const { User, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if(!name || !phone || !password) return res.status(400).json({error: 'Missing Required parameters'});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, phone, email, password: hashedPassword });

    res.status(201).json({data : user, message : "User Registered Successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if(!phone || !password) return res.status(400).json({error : 'Required params missing'});

    const user = await User.findOne({ where: { phone } });
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
