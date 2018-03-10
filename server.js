const express = require('express');

const app = express();

app.use(express.static('client'));






app.get('*', (req, res) => res.redirect('/'));


app.listen(process.env.PORT || 3000);