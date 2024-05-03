const request = require("request-promise-native");

async function checkToken(authToken) {
 try {
  await request.get({
   url: `https://discord.com/api/v10/users/@me`,
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