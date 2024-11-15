const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));