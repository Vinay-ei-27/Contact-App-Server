const { Contact, User, Op } = require('../models');

const markAsSpam = async (req, res) => {
  try {
    const { phone } = req.body;
    const contact = await Contact.findOne({ where: { phone } });
    if (contact) {
      contact.isSpam = true;
      await contact.save();
    } else {
      await Contact.create({ name: 'Unknown', phone, isSpam: true, userId: req.userId });
    }
    res.status(200).json({ message: 'Number marked as spam' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByName = async (req, res) => {
  try {
    const { name } = req.query;

    // First, search for users whose names start with the search query
    const startWithName = await User.findAll({
      where: { name: { [Op.iLike]: `${name}%` } },
      include: [{ model: Contact, as: 'contacts' }],
    });

    // Then, search for users whose names contain but don't start with the search query
    const containName = await User.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
          [Op.notILike]: `${name}%`,
        },
      },
      include: [{ model: Contact, as: 'contacts' }],
    });

    // Combine both results
    const combinedResults = [...startWithName, ...containName];

    res.json(combinedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    // First, search for a registered user with the provided phone number
    const registeredUser = await User.findOne({
      where: { phone },
      include: [{ model: Contact, as: 'contacts' }],
    });

    if (registeredUser) {
      // If a registered user is found, return only that user
      return res.json([registeredUser]);
    } else {
      // If no registered user is found, search for contacts with the provided phone number
      const contacts = await Contact.findAll({
        where: { phone },
        include: [{ model: User, as: 'user' }],
      });

      res.json(contacts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { markAsSpam, searchByName, searchByPhone };
