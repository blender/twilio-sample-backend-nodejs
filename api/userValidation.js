const crypto = require('crypto');

const usersStorage = new Map();


// ((?:DEV|PRD)__[0-9a-f]{14}_\d{8}|drozimport_attrib__[a-z09-]*|(?:OIAM_|(?:SSO|AUTHMGT)-\d+)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{14}_[0-9a-f]{8})_([\w-]*\.[\w-]*\.[\w-]{86})

const generateUserToken = () => crypto.randomBytes(32).toString('base64');
const pseudoEncodeToken = (identity, token) => usersStorage.set(token, identity);
const pseudoDecodeToken = (token) => token.split('_')[0];
const pseudoVerifyToken = (token) => true;

const requireAuthHeader = (req, res, next) => {
  // 'Check if request is authorized with token from POST /authorize'
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
    res.statusMessage = "No Authorization header";
    res.status(401).send('Unauthorized');
    return;
  }

  const userToken = req.headers.authorization.split('Bearer ')[1];

  if (!pseudoVerifyToken(userToken)) res.status(401).send('Unauthorized help');

  req.user = { identity: pseudoDecodeToken(userToken) };
  next();
}

module.exports = {
  generateUserToken,
  pseudoEncodeToken,
  pseudoDecodeToken,
  pseudoVerifyToken,
  requireAuthHeader,
}