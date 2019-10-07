const firebase = require('firebase');
require('firebase/storage');

const config = {
  appId: process.env.FIREBASE_API_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_BASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};
const app = firebase.initializeApp(config);
const storage = app.storage();
exports.storage = storage;
