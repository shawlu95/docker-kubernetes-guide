const express = require('express');
const app = express();

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.listen(80, () => {
  console.log('up and running');
});
