const express = require("express");

const router = express.Router();

const chatbotController = require("../controller/chatbot.controller");

const { verifyToken }  = require("../middleware/auth.middleware");

router.post(
   "/",
   verifyToken ,
   chatbotController.chat
);

module.exports = router;