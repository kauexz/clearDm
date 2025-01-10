const request = require("request-promise-native");

async function checkToken(authToken) {
 try {
  await request.get({
   url: `https://kaue.squareweb.app/check-token`,
   headers: { Authorization: authToken },
   json: true,
  });
  return true;
 } catch (error) {
  if (error.statusCode === 401) {
   return false;
  } else {
   throw error;
  }
 }
}

module.exports = { checkToken };
