const { v2: cloudinary } = require("cloudinary");

async function cloudinaryService() {
  // Configuration
  cloudinary.config({
    cloud_name: "dkir8rl9r",
    api_key: "219588365667336",
    api_secret: "9FCup7mXgKlvbDCcixXSSXyvJTM", // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
}

module.exports = cloudinaryService;
