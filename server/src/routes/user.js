var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);
router.get("/myMusic/:user_id", userController.myMusic);
router.post("/public", userController.publicMusic);

module.exports = router;
