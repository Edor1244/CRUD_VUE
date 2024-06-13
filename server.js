const express = require('express');
const cors = require('cors');
const { sequelize, Usuario } = require('./src/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Op } = require('sequelize');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

//                                     <------- Seccion de Usuarios ------->

const verifyRecaptcha = require('./src/MiddleWare/verifyRecaptcha'); // Asegúrate de que la ruta sea correcta
const e = require('express');
// Crear un usuario nuevo

app.post('/api/usuario',verifyRecaptcha, async (req, res) => {
  console.log(req.body);
  console.log('Estamos en el post de usuario');
  const { username, password,nombre ,apellido1,apellido2,email } = req.body;
  // Generar un hash de la contraseña
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error('Error al generar el hash de la contraseña:', err);
      return res.status(500).send('Error interno del servidor');
    }
    try {
      // Crear el usuario con la contraseña encriptada
      const usuario = await Usuario.create({ username, password: hash,nombre,apellido1,apellido2, email });
      res.json(usuario);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).send('Error al crear el usuario');
    }
  });
});

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const usuarios = await Usuario.findAll();

    // Mapear los usuarios para ocultar la contraseña hasheada
    const usuariosConContraseña = usuarios.map(usuario => {
      // Crear un nuevo objeto de usuario con la contraseña desencriptada
      return {
        id: usuario.id,
        username: usuario.username,
        password: usuario.password, // Aquí está la contraseña sin encriptar
      };
    });

    // Devolver los usuarios con la contraseña sin encriptar en la respuesta
    res.json(usuariosConContraseña);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id, {
    attributes: ['username', 'password'] // Especifica las columnas que deseas seleccionar
  });
  res.json(usuario);
});

// Actualizar un usuario
app.put('/api/usuarios/:id', async (req, res) => {
  const { username, password } = req.body;
  const usuario = await Usuario.findByPk(req.params.id);
  usuario.username = username;
  usuario.password = password;
  await usuario.save();
  res.json(usuario);
});
// Actualizar contraseña user
app.put('/api/usuariosPassRecovery', async (req, res) => {
  const { password , username} = req.body;

  // Generar un hash de la contraseña
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error('Error al generar el hash de la contraseña:', err);
      return res.status(500).send('Error interno del servidor');
    }

    try {
      // Buscar al usuario por su UserName
      const usuario = await Usuario.findOne({ where: { username: username } });

      // Actualizar la contraseña del usuario con la contraseña encriptada
      usuario.password = hash;

      // Guardar el usuario actualizado en la base de datos
      await usuario.save();

      // Enviar la respuesta al cliente
      res.json(usuario);
    } catch (error) {
      console.error('Error al actualizar la contraseña del usuario:', error);
      res.status(500).send('Error al actualizar la contraseña del usuario');
    }
  });
});
// Eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  await usuario.destroy();
  res.json({ message: 'Usuario eliminado' });
});

// Endpoint de inicio de sesión
app.post('/api/login',verifyRecaptcha, async (req, res) => {
  const { username, password, recaptchaToken } = req.body;

  // Buscar el usuario en la base de datos por su nombre de usuario
  const usuario = await Usuario.findOne({ where: {
      [Op.or]: [
        {username: username},
        {email: username}
      ]
    } });

  // Verificar si el usuario existe
  if (!usuario) {
    return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
  }

  // Comparar la contraseña proporcionada con la contraseña hasheada almacenada
  bcrypt.compare(password, usuario.password, (err, result) => {
    if (err) {
      console.error('Error al comparar contraseñas:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Verificar si la contraseña coincide
    if (result) {
      // Autenticación exitosa
      let dataUser = [
        usuario.id,
        usuario.username,
        usuario.nombre,
        usuario.apellido1,
        usuario.apellido2,
        usuario.email
      ];
      console.log(dataUser);
      console.log(usuario);
      res.json({ message: '¡Inicio de sesión exitoso!', User: dataUser, Token: recaptchaToken});
    } else {
      // Autenticación fallida
      res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }
  });
});


