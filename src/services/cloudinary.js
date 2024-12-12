const { v2: cloudinary } = require("cloudinary");

async function cloudinaryService() {
  // Configuration
  cloudinary.config({
    cloud_name: "dkir8rl9r",
    api_key: "219588365667336",
    api_secret: "9FCup7mXgKlvbDCcixXSSXyvJTM", // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        folder: "sq_ecommerce/banner", // Chỉ định thư mục
        public_id: "shoes_image", // Tên file sau khi upload (không bắt buộc)
      }
    )
    .then((result) => {
      console.log("Upload thành công:", result);
    })
    .catch((error) => {
      console.error("Upload thất bại:", error);
    });
  console.log(uploadResult);
}

module.exports = cloudinaryService;
