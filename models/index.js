const { Sequelize, DataTypes, Op } = require('sequelize');
const userModel = require('./user');
const contactModel = require('./contact');
const dotenv = require('dotenv');

const path = require('path');
const dirname = __dirname;

const configPath = path.join(dirname, '../.env');

dotenv.config({ path: configPath });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

const User = userModel(sequelize, DataTypes);
const Contact = contactModel(sequelize, DataTypes);

User.hasMany(Contact, { as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sync database and create tables
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database & tables created!');
    // Now you can call your seed function here if desired
    // seedDatabase();
  } catch (err) {
    console.error('Unable to create database and tables:', err);
  }
}

module.exports = {
  User,
  Contact,
  sequelize,
  Op,
  initializeDatabase
};
