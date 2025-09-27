require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ocrRoutes = require('./routes/ocrRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/ocr', ocrRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;