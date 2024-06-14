const express = require('express');
const cors = require('cors');
const { sequelize, Usuario, Video } = require('./src/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Op } = require('sequelize');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
const axios = require('axios');
const PORT = process.env.PORTAPI || 3000;

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
//       <------------ Endpoint de inicio de sesión ---------->
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
    return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos no exite' });
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
      res.status(401).json({ message: 'Error Diferente' });
    }
  });
});

//       <------------ Endpoints de Funcionalidad Youtube ---------->


app.post('/api/favorites', async (req, res) => {
  try {
    console.log('Estamoes en Post de Api/Favorites', req.body);
    const { usuario, video } = req.body; // Cambié userId a usuario

    // Encuentra o crea el video
    const [videoInstance, created] = await Video.findOrCreate({
      where: { id: video.id },
      defaults: { title: video.title }
    });

    // Encuentra el usuario por su ID
    const user = await Usuario.findByPk(usuario);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Añadir el video a la lista de favoritos del usuario
    await user.addVideo(videoInstance);

    res.status(201).send('Favorite added');
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).send('Error adding favorite');
  }
});
app.delete('/api/favorites', async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    // Encuentra el usuario por su ID
    const user = await Usuario.findByPk(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Encuentra el video por su ID
    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).send('Video not found');
    }

    // Remover el video de la lista de favoritos del usuario
    await user.removeVideo(video);

    res.status(200).send('Favorite removed');
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).send('Error removing favorite');
  }
});

// Mostrar Lista de Favoritos

app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Encuentra el usuario por su ID
    const user = await Usuario.findByPk(userId, {
      include: Video // Incluye los videos favoritos del usuario
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Devuelve los videos favoritos del usuario
    res.status(200).json(user.videos);
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).send('Error retrieving favorites');
  }
});





app.get('/api/videos', async (req, res) => {
  try {
    console.log('Estamos en el get de videos', );
    const query = req.query.q || '';
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        type: 'video',
        part: 'snippet',
        q: query,
      },
    });
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
    }));

    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Error fetching videos' });
  }
});




