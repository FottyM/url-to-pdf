require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SitePdf = require('site-pdf');
const fs = require('fs');
const Blob = require('blob');
const uriel = require('url');
const path = require('path');
const util = require('util');
const n = require('nonce')();
const { storage } = require('./utils/firebase');

const storageRef = storage.ref();
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
    paperSize: { format: 'A4', orientation: 'portrait' },
  });
  pdf.create(href, `${filePath}`).then(() => {
    const fileUrl = uriel.pathToFileURL(filePath);
    readFile(`${filePath}`)
      .then((pdfData) => {
        const pdfRef = storageRef.child(`pdfs/${fileName}`);
        // console.log(new Blob(pdfData), 'lolla et reclame kaka ngai');
        // res.send({ pdfData });
        File();
        try {
          console.log(new Blob([...Buffer.from(pdfData)]), 'Kiara');
        } catch (error) {
          console.log(error);
          res.status(400).json({ error, message: 'Bad request' });
        }

        pdfRef
          .put((pdfData))
          .then((snap) => {
          // console.log(snap.downloadURL);
            res.status(201).json({ downloadURL: snap.downloadURL });
          }).catch((err) => res.status(500).json({
            message: 'something is up',
            err,
          }));

        pdf.destroy();
      })
      .catch((err) => res.status(500).json(err));
  }).catch((err) => {
    res.status(500).json(err);
  });
});

app.use('/api', routes);
app.listen(PORT, () => console.log(`http://localhost:${PORT}/api`));
