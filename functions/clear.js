const request = require("request-promise-native");

async function getDMChannelId(authToken, id) {
 try {
  await request.get({
   url: `https://discord.com/api/v10/channels/${id}`,
   headers: { Authorization: authToken },
   json: true,
  });
  return id;
 } catch (error) {
  if (error.statusCode === 404) {
   try {
    const result = await request.post({
     url: `https://discord.com/api/v10/users/@me/channels`,
     headers: { Authorization: authToken },
     json: true,
     body: { recipient_id: id },
    });
    return result.id;
   } catch (error) {
    console.error(error.message);
    throw error;
   }
  } else {
   console.error(error.message);
   throw error;
  }
 }
}

async function clearMessage(authToken, channelId, messageId) {
 try {
  await new Promise((resolve) => setTimeout(resolve, 606));
  await request.delete({
   url: `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`,
   headers: { Authorization: authToken },
   json: true,
  });
 } catch (error) {
  if (error.response && error.response.body && error.response.body.retry_after) {
   await new Promise((resolve) => setTimeout(resolve, error.response.body.retry_after || 1000));
   return clearMessage(authToken, channelId, messageId);
  } else {
   console.error(error.message);
  }
 }
}

async function countMessages(authToken, effectiveChannelId, authorId) {
 let totalCount = 0;
 let lastMessageId = null;

 while (true) {
  const params = lastMessageId ? `?before=${lastMessageId}&limit=100` : "?limit=100";
  try {
   const messages = await request({
    url: `https://discord.com/api/v10/channels/${effectiveChannelId}/messages${params}`,
    headers: { Authorization: authToken },
    json: true,
   });

   if (!messages.length) break;

   const relevantMessages = messages.filter((message) => message.author.id === authorId);
   totalCount += relevantMessages.length;

   lastMessageId = messages[messages.length - 1].id;
  } catch (error) {
   console.error(error.message);
   break;
  }
 }

 return totalCount;
}

async function clearChannel(authToken, authorId, channelId, limit, progressCallback) {
 let effectiveChannelId = await getDMChannelId(authToken, channelId);
 let totalCount = await countMessages(authToken, effectiveChannelId, authorId);
 let deletedCount = 0;

 async function deleteMessages() {
  let lastMessageId = null;

  while (true) {
   const params = lastMessageId ? `?before=${lastMessageId}&limit=100` : "?limit=100";
   const messages = await request({
    url: `https://discord.com/api/v10/channels/${effectiveChannelId}/messages${params}`,
    headers: { Authorization: authToken },
    json: true,
   });

   if (!messages.length) break;

   for (const message of messages) {
    if (message.author.id === authorId) {
     await clearMessage(authToken, effectiveChannelId, message.id);
     deletedCount++;
     await progressCallback(deletedCount, totalCount);

     if (limit !== null && deletedCount >= limit) return;
    }
   }

   lastMessageId = messages[messages.length - 1].id;
  }
 }

 await deleteMessages();
 return { deletedCount };
}

module.exports = { clearChannel };