const { OAuth2Client } = require("google-auth-library");
const clientAndroid = new OAuth2Client(process.env.ANDROID);

const googleVerify = async (token) => {
  //async function googleVerify( token ){
  try {
    const ticket = await clientAndroid.verifyIdToken({
      idToken: token,
      audience: process.env.ANDROID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    return { name, email, picture };
    
  } catch (err) {
    console.log(err);
    return {}
  }
  
};

module.exports = {
  googleVerify,
};
