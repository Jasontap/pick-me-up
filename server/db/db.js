const Sequelize = require("sequelize");

//taken from Nick
let config;
if (process.env.DATABASE_URL) {
  config = {
    logging: false,
    operatorsAliases: false,
    dialect: "postgres",
    protocol: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
} else {
  config = {
    logging: false,
    // operatorsAliases: false,
  }
}


if(process.env.LOGGING){
  delete config.logging
}

// MIKE
  // const db = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:JerryPine@localhost/basketball', config);
// JASON
const db = new Sequelize('basketball', 'postgres', 'master', {
  dialect: 'postgres'
})
// MAC
// const db = new Sequelize(
// 	process.env.DATABASE_URL || "postgres://localhost/basketball", config
// );

module.exports = db;
