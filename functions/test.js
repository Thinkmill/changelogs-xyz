exports.handler = async (event, context) => {
  return { statusCode: 200, body: `app ID: ${process.env.ALGOLIA_APP_ID}` };
};
