const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { User, Contact, initializeDatabase } = require('../models/index.js');

async function seedDatabase() {
  try {

    // Initialize the database first
    await initializeDatabase();

    const users = [];
    const contacts = [];

    for (let i = 0; i < 10; i++) {
      const fullName = faker.person.fullName();
      const password = faker.internet.password();

      console.log(fullName, password, '-->');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      users.push({
        name: fullName,
        phone: faker.phone.number(),
        email: faker.internet.email(),
        password: hashedPassword
      });

      // Generate 25 contacts for each user
      for (let j = 0; j < 25; j++) {
        contacts.push({
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          isSpam: faker.datatype.boolean(),
          userId: i + 1  // This assumes auto-incrementing IDs starting from 1
        });
      }
    }

    // Bulk create users and contacts
    await User.bulkCreate(users);
    await Contact.bulkCreate(contacts);

    console.log('Sample data generated successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

//seedDatabase();
