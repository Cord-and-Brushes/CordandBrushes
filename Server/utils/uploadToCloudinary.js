const cloudinary = require('../config/cloudinary');

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
     const stream = cloudinary.uploader.upload_stream(
       { resource_type: "auto" },
       (error, result) => {
         if (error) reject(error);
         else resolve(result.secure_url);
       }
     );
     stream.end(file.buffer);
  });
}

module.exports = uploadToCloudinary;
