const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');
const PUBLIC_VAPID = 'BIGKUYhw3Ns4zYynxbrY72mzFVbPTSlsLb44pnmV-IeKz0RUFpZ8-8IGeyykNCVjroyAFTEn87kw2qGsHG42lo0';
const PRIVATE_VAPID = 'gpFlFQVQdP1le-aJZqubxn2YRvI1f51oFPRyQJwY3Do';

const fakeDatabase = [];
const app = express();

app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails('mailto:you@domain.com', PUBLIC_VAPID, PRIVATE_VAPID);

app.post('/subscription', (req, res) => {
  const subscription = req.body;
  console.log('registering user', subscription);
  fakeDatabase.push(subscription);
});

app.post('/sendNotification', (req, res) => {
  const notificationPayload = {
    notification: {
      title: 'Test Notification',
      body: 'Notification Body',
      icon: 'assets/icons/icon-512x512.png'
    }
  };
  console.log('Sending message', notificationPayload);
  const promises = [];
  fakeDatabase.forEach(subscription => {
    promises.push(webpush.sendNotification(subscription, JSON.stringify(notificationPayload)));
  });
  Promise.all(promises).then(() => res.sendStatus(200));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
