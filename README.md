# Stool Size Detector

A web-based application that uses computer vision to detect and classify stool sizes from images. This application uses OpenCV.js for image processing and analysis, with accurate measurements through calibration.

## Features
- Upload images for analysis
- Real-time image processing
- Accurate size measurements in millimeters
- Calibration system using reference objects
- Bristol Stool Scale classification
- Size classification (Small, Medium, Large)
- Browser-based processing (no server required)

## Technologies Used
- HTML5
- JavaScript
- OpenCV.js
- Canvas API

## Setup and Installation
1. Clone this repository
2. Ensure you have the OpenCV.js file in your project directory
3. Open index.html in a modern web browser

## Usage
1. **Calibration (Required)**:
   - Select a reference object (US Quarter, US Penny, or custom size)
   - Click the "Calibrate" button
   - Click two points on your reference object to measure its diameter
   - Wait for calibration confirmation

2. **Image Analysis**:
   - Click the "Choose Image" button to select an image
   - The application will automatically process the image
   - View the classification results and measurements

## Measurement System
- **Calibration**: Uses common coins or custom objects as reference
  - US Quarter (24.26mm)
  - US Penny (19.05mm)
  - Custom size option available

- **Size Classifications**:
  - Small: < 30mm
  - Medium: 30-50mm
  - Large: > 50mm

## Bristol Stool Scale Classification
- **Type 1-2**: Separate hard lumps
- **Type 3-4**: Snake-like/sausage shape
- **Type 5-7**: Soft blobs/liquid

## Features Added in Latest Update
- Calibration system for accurate measurements
- Reference object selection
- Measurement display in millimeters
- Improved contour detection
- Enhanced visualization with measurement overlay
- Bristol Stool Scale reference guide

## Deployment
This application is deployed using GitHub Pages and can be accessed at https://martinezworldwide.github.io/WebRTC/

## License
MIT License