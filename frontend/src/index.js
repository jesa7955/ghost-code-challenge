const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));
app.get('/main.js', (req, res) => res.sendFile(path.join(__dirname, '../dist/main.js')));

app.listen(port, () => console.log(`Listening on port ${port}!`));
