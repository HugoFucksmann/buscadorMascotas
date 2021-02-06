const { sendNotificationToken } = require("../controllers/notification");

const { Router } = require("express");

const router = Router();

router.get("/", sendNotificationToken);

module.exports = router;
