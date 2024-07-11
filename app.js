const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');
const dirname = __dirname;

const configPath = path.join(dirname, './.env');

dotenv.config({ path: configPath });

const app = express();

sequelize
.authenticate()
.then(() => {
  console.log('Database connected...');
})
.catch((err) => {
  console.error('Unable to connect to the database:', err);
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send(`<center><h1 style="margin-top: 30px;">Authenticate Server</h1></center>`);
});

app.all('*', (req, res) => {
  res.status(404).send('Sorry, this page does not exist.');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
