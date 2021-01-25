const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
 
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };
    
    jwt.sign( payload, process.env.JWT_SECRET, {
        expiresIn: "12h",
      }, (err, token) => {
        if (err) {
          console.log(err);
          reject("no se pudo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const verificarJWT = (token) => {
  try {
    const { uid } = jwt.verify(token, process.env.SECRETJWT);
    if (uid) return true;
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  generarJWT,
  verificarJWT,
};
