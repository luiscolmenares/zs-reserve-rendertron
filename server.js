const express = require('express');
const rendertron = require('rendertron-middleware');

const app = express();

app.use(rendertron.makeMiddleware({
  proxyUrl: 'http://localhost:3000/render',
}));

app.use(express.static('src'));
app.listen(9000);
console.log('Zonasoccer Server is Listening on port 9000');