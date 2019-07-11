const jsonfile = require('jsonfile')
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const serveStatic = require('serve-static');

const dataFilePath = path.join(__dirname, 'poi.json');

const app = express();

let data = [];

jsonfile.readFile(dataFilePath, function (err, obj) {
  if (err) console.error(err)
  data = obj;
});

app.use(bodyParser.json());

app.use(serveStatic(path.join(__dirname, 'public')));


app.get('/poi', async (req, res) => {
  return res.send(data);
});

app.get('/poi/:id', async (req, res) => {
  let p = data.find(p => p.id == req.params.id);
  if (!p) {
    return res.sendStatus(404);
  }

  return res.send(p);
});

app.put('/poi/:id', (req, res) => {
  let p = data.find(p => p.id == req.params.id);
  if (!p) {
    return res.sendStatus(404);
  }
  if ((!req.body.type && req.body.type !== 0) || [0, 1, 2, 3, 4].indexOf(req.body.type) === -1) {
    return res.sendStatus(400);
  }

  p.type = req.body.type;

  jsonfile.writeFile(dataFilePath, data, function (err) {
    if (err) console.error(err)
  })

  return res.send(p);
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`App listening on port ${port}!`),
);
