const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SitePdf = require('site-pdf');
const fs = require('fs');
const os = require('os');
const uriel = require('url');
const path = require('path');
const util = require('util');
const n = require('nonce')();

const readFile = util.promisify(fs.readFile);
const app = express();
const routes = express.Router();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


routes.post('/toPdf', (req, res) => {
  const { href, hostname } = new URL(req.body.url);
  const timeStamp = n();
  const fileName = `${hostname}${timeStamp}.pdf`;
  const filePath = path.resolve('pdfs', fileName);
  const pdf = new SitePdf({
    userAgent: 'sitePDF',
    paperSize: {
      format: 'A4',
      orientation: 'portrait',
    },
  });
  pdf
    .create(href, `${filePath}`).then(() => {
      const fileUrl = uriel.pathToFileURL(filePath);
      const ultimateUrl = uriel.format({
        host: os.hostname,
        pathname: filePath,
        path: filePath,
      });
      console.log(ultimateUrl, '...........', fileUrl);
      readFile(`${filePath}`)
        .then((pdfData) => {
          res.status(201).json({ fileUrl, ultimateUrl });
        })
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.use('/api', routes);
app.listen(PORT, () => console.log(`http://localhost:${PORT}/api`));
