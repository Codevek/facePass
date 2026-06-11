const prisma = require("../utils/prisma");
const axios = require("axios");

exports.enrollFace = async (req, res) => {
  try {

    const userId = req.userId;
    console.log("User:", userId);

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image required"
      });
    }

    const response = await axios.post(
      "http://localhost:8000/enroll",
      { image }
    );

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: response.data.message
      });
    }

    const embedding =
      response.data.embedding;

    await prisma.faceEmbedding.upsert({
      where: {
        userId
      },
      update: {
        embedding
      },
      create: {
        userId,
        embedding
      }
    });

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        faceEnrolled: true
      }
    });

    return res.json({
      success: true,
      message: "Face enrolled successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
};