const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');

const userHandler = require('./data/user/handler');

const app = express();
app.use(bodyParser.json({ strict: false }));

const getOwner = (request) => {
  if (!request.context || !request.context.identity || !request.context.identity.cognitoIdentityId || !request.context.identity.cognitoAuthenticationProvider) {
    throw new Error('NotAuthorized');
  }

  const providerParts = request.context.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:');

  // For testing, you might want to just generate a uuid and return it. Set that as the 'owner' value of your user record.
  return providerParts[1];
}

app.get('/app/users/me', async (request, response) => {
  const owner = getOwner(request);
  try {
    const userResponse = await userHandler.get(owner);
    response.json(userResponse);
  } catch (error) {
    response.status(error.status).json({
      code: error.name,
      error: error.message,
      fields: error.fields,
    });
  }
});

module.exports.handler = serverless(app, {
  request: (request, event, context) => {
    request.context = event.requestContext;
    request.awsContext = context;
  }
});