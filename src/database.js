const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

const Producto = sequelize.define('producto', {
  nombre: Sequelize.STRING,
  descripcion: Sequelize.STRING,
  precio: Sequelize.FLOAT,
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
}, {
  timestamps: false // Desactivar la creación automática de las columnas createdAt y updatedAt
});



//Exportar los modelos
module.exports = {
  sequelize,
  Producto,
  Usuario,
};