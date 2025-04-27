# Face-API.js Models

This directory contains the models required for face-api.js to work properly.

## Required Models

The following models are required for the facial recognition search feature:

1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model-shard1`
3. `face_landmark_68_model-weights_manifest.json`
4. `face_landmark_68_model-shard1`
5. `face_recognition_model-weights_manifest.json`
6. `face_recognition_model-shard1`
7. `face_recognition_model-shard2`

## How to Download Models

You can download these models from the face-api.js GitHub repository:

```bash
# Create the models directory structure
mkdir -p public/models

# Download the tiny face detector model
curl -o public/models/tiny_face_detector_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -o public/models/tiny_face_detector_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Download the face landmark model
curl -o public/models/face_landmark_68_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -o public/models/face_landmark_68_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Download the face recognition model
curl -o public/models/face_recognition_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -o public/models/face_recognition_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
curl -o public/models/face_recognition_model-shard2 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```

Or you can download them manually from the [face-api.js GitHub repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in this directory.
