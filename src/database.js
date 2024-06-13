const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

// Definir el modelo de usuario
const Usuario = sequelize.define('usuario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  nombre: Sequelize.STRING,
  apellido1: Sequelize.STRING,
  apellido2: Sequelize.STRING,
  email: Sequelize.STRING,
}, {
  timestamps: false // Desactivar la creación automática de las columnas createdAt y updatedAt
});
//Definir el modelo de Video
const Video = sequelize.define('video', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  title: Sequelize.STRING,
}, {
  timestamps: false
});
Usuario.belongsToMany(Video, { through: 'UsuarioVideo' });
Video.belongsToMany(Usuario, { through: 'UsuarioVideo' });

sequelize.sync({ force: false }).then(() => {
  console.log('Tablas creadas');
});
//Exportar los modelos
module.exports = {
  sequelize,
  Usuario,
  Video,
};