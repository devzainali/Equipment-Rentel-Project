const Sequelize = require("sequelize");
const configuration = require('../../config/config.json');

console.log(configuration.development);

// const Config = require('config');
// const dbConfig = Config.get(process.env.NODE_ENV);
// console.log(dbConfig);
// const mysql2 =   require("mysql2");


const sequelize = new Sequelize('moquire', 'moquire', 'moquire123#', {
  host: 'localhost',
  dialect: 'mysql',
  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  logging: function () { },
  dialectOptions: {
    socketPath: "/var/run/mysqld/mysqld.sock"
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    paranoid: true,
    timestamps: false
  },
 logging: true,
  //freezeTableName: true,
  //operatorsAliases: false
});


sequelize.authenticate()
  .then(() => {
    console.log('connected to DB');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
global.sequelize = sequelize;
