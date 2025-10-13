const fs = require("fs");
const path = require("path");

const galleryDir = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "images",
  "gallery",
  "sports-day"
);

exports.handler = async (event, context) => {
  try {
    const files = await fs.promises.readdir(galleryDir);

    const imageFiles = files.filter((fileName) =>
      /\.(jpe?g|png|gif|webp)$/i.test(fileName)
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageFiles),
    };
  } catch (error) {
    console.error("Error reading gallery directory:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to list gallery images." }),
    };
  }
};
