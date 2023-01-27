const functions = require('firebase-functions');
const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');

initializeApp({
  projectId: 'youchoose-9c077977',
});

// load controllers after the initializeApp
const internalCtrl = require('./controllers/internal');

const auth = getAuth();
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const app = express();
app.use(express.json());

// private api
app.post(
  '/api/edge/occupancies',
  body('assetId').isString(),
  body('relativeOccupancy').isNumeric(),
  body('absoluteOccupancy').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // find the respective location
    const querySnapshot = await db
      .collection('locations')
      .where('assetId', '==', req.body.assetId)
      .get();

    querySnapshot.forEach((docItr) => {
      docItr.ref.set(
        {
          relativeOccupancy: req.body.relativeOccupancy,
          absoluteOccupancy: req.body.absoluteOccupancy,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    });

    res.status(204).send();
  },
);

// internal api
app.get('/api/internal/sanity', (_, res) => {
  res.send('YouChoose v0.1.0');
});
app.post('/api/internal/sanity', internalCtrl.onSanityCreateUpdate);
app.delete('/api/internal/sanity', internalCtrl.onSanityDelete);
app.post(
  '/api/internal/sanityReconciliation',
  internalCtrl.onSanityReconciliation,
);

app.post(
  '/api/internal/aggregatePopularTimes',
  internalCtrl.onAggregatePopularTimes,
);

// public api
app.get('/api/locations', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.json({ bongs: 'BONG '.repeat(hours) });
});

async function validateAuthorizationCodeAndReturnUserId(authorizationCode) {
  const apiUrl = process.env.API_URL || 'http://localhost:5001';
  const options = {
    method: 'POST',
    url: 'https://youchoose.eu.auth0.com/oauth/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip',
    },
    data: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'SkMyjsfZf2SVsHv2lTIwm5QfN1R6Bg0W',
      client_secret:
        'HdCpjUmUphpfyFvGoQblGPKDiTzO2HH2FHnbcowVD1sOP4YPMO8zKNiBPQ-LyocF',
      code: authorizationCode,
      redirect_uri: apiUrl,
    }),
  };

  const response = await axios.request(options);
  const accessToken = response.data.access_token;
  const decodedToken = jwt.decode(accessToken);
  return decodedToken.sub;
}

async function findOrCreateUserById(userId, tenantId) {
  try {
    const user = await admin.auth().getUser(userId);
    await admin.auth().setCustomUserClaims(user.uid, { tenantId });
    return user;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return await admin.auth().createUser({ uid: userId });
    } else {
      throw error;
    }
  }
}

app.post('/api/authCallback', async (req, res) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  console.log(' req.body.state', req.body.state);

  try {
    const userId = await validateAuthorizationCodeAndReturnUserId(
      req.body.code,
    );
    if (!userId) {
      res.redirect(appUrl);
      return;
    }

    const user = await findOrCreateUserById(
      userId,
      'fb69d2c4-be03-4516-b935-887bb5b6a54d',
    );

    const customToken = await auth.createCustomToken(user.uid);

    let safeAppUrl = appUrl;
    if (safeAppUrl.includes('youchoose.space') && req.body.state) {
      safeAppUrl = `https://${req.body.state}.youchoose.space`;
    }
    res.redirect(`${safeAppUrl}/?token=${customToken}`);
  } catch (err) {
    console.log(err);
    res.redirect(appUrl);
  }
});

// 404 / catch all handler
app.get('*', (_, res) => {
  res.send('YouChoose v0.1.0');
});

exports.api = functions
  .region('europe-west6')
  .runWith({
    serviceAccount:
      'firebase-adminsdk-5yfkd@youchoose-9c077977.iam.gserviceaccount.com',
  })
  .https.onRequest(app);
