const express = require('express');
const cors = require('cors');
const { sequelize, Producto, Usuario } = require('./src/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());

// Crear un nuevo producto  <---------Seccion de Videos--------> 
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const producto = await Producto.create({ nombre, descripcion, precio });
  res.json(producto);
});

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

// Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  res.json(producto);
});

// Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const producto = await Producto.findByPk(req.params.id);
  producto.nombre = nombre;
  producto.descripcion = descripcion;
  producto.precio = precio;
  await producto.save();
  res.json(producto);
});

// Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  await producto.destroy();
  res.json({ message: 'Producto eliminado' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});



//                                     <------- Seccion de Usuarios ------->
// Crear un usuario nuevo
app.post('/api/usuario', async (req, res) => {
  const { username, password } = req.body;

  // Generar un hash de la contraseña
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error('Error al generar el hash de la contraseña:', err);
      return res.status(500).send('Error interno del servidor');
    }
    try {
      // Crear el usuario con la contraseña encriptada
      const usuario = await Usuario.create({ username, password: hash });
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

// Eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  await usuario.destroy();
  res.json({ message: 'Usuario eliminado' });
});

// Endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en la base de datos por su nombre de usuario
  const usuario = await Usuario.findOne({ where: { username } });

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
      res.json({ message: '¡Inicio de sesión exitoso!'});
    } else {
      // Autenticación fallida
      res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }
  });
});
