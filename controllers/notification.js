

const sendNotificationToken = async (req, res = response) => {
    const users = await Usuario.find();
    const tokens = users.map((user) => user.notification)
    console.log(tokens);

};


module.exports = {
  sendNotificationToken,
};