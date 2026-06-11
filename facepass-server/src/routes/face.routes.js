const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/auth.middleware");

const {
  enrollFace
} = require("../controllers/face.controller");

router.post(
  "/enroll",
  authMiddleware,
  enrollFace
);

module.exports = router;