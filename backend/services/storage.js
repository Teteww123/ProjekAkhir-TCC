const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Fungsi upload file
async function uploadFile(filePath, destFileName) {
  await bucket.upload(filePath, {
    destination: destFileName,
    public: true,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  return `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${destFileName}`;
}

module.exports = { uploadFile };