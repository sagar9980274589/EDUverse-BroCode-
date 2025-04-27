const fs = require('fs');
const path = require('path');
const https = require('https');

const MODELS_DIR = path.join(__dirname, '../public/models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// List of model files to download
const MODEL_FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  console.log(`Creating directory: ${MODELS_DIR}`);
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

// Function to download a file
function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const fileUrl = `${BASE_URL}/${filename}`;
    const filePath = path.join(MODELS_DIR, filename);
    
    console.log(`Downloading ${fileUrl}...`);
    
    const file = fs.createWriteStream(filePath);
    
    https.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all model files
async function downloadAllModels() {
  console.log('Starting download of face-api.js models...');
  
  try {
    for (const file of MODEL_FILES) {
      await downloadFile(file);
    }
    console.log('All models downloaded successfully!');
  } catch (error) {
    console.error('Error downloading models:', error);
    process.exit(1);
  }
}

downloadAllModels();
