const { User, Contact } = require('../models');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{ model: Contact, as: 'contacts' }],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile };
