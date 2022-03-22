const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const config = require("config");

const s3 = new S3({
  region: config.get("bucket_region"),
  accessKeyId: config.get("access_key"),
  secretAccessKey: config.get("secret_key"),
});

// UPLOAD FILE TO S3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: config.get("bucket_name"),
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise(); // this will upload file to S3
}

// DOWNLOAD FILE FROM S3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: config.get("bucket_name"),
  };
  return s3.getObject(downloadParams).createReadStream();
}
module.exports = { uploadFile, getFileStream };
