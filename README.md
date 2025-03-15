# Stool Size Detector

A mobile-friendly web application that uses computer vision to detect and classify stool sizes from images. This application uses OpenCV.js for image processing and analysis, with optional calibration for precise measurements.

## Key Features
- 📱 Mobile-first design
- 📸 Direct camera access for instant photos
- 🔄 Real-time image processing
- 📏 Optional calibration for precise measurements
- 📊 Bristol Stool Scale classification
- 📱 Works offline (no server required)

## Quick Start
1. Visit https://martinezworldwide.github.io/WebRTC/
2. Allow camera access if prompted
3. Choose one of two options:
   - 📸 "Take Photo" - Uses your device's camera
   - 📤 "Upload Image" - Select an image from your device

## Measurement Options
### Quick Measurement (No Calibration)
- Just take a photo or upload an image
- Get immediate size estimates and Bristol Scale classification
- Measurements will be approximate

### Precise Measurement (With Calibration)
1. Click "Optional Calibration"
2. Select reference object:
   - US Quarter (24.26mm)
   - US Penny (19.05mm)
   - Custom size object
3. Take photo/upload image with reference object
4. Click two points on your reference object
5. Get precise measurements

## Results Provided
- Size Classification (Small/Medium/Large)
- Length and width in millimeters
- Bristol Stool Scale type
- Shape analysis
- Visual contour detection

## Mobile Features
- Optimized for smartphones and tablets
- Touch-friendly interface
- Direct camera integration
- Responsive design
- Works in any orientation

## Technical Details
### Technologies Used
- HTML5 & Modern CSS
- JavaScript (ES6+)
- OpenCV.js
- MediaDevices API for camera access
- Canvas API for image processing

### Browser Support
- Chrome (recommended)
- Safari
- Firefox
- Edge

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Martinezworldwide/WebRTC.git
   ```
2. Open index.html in a modern web browser
3. No additional setup required

## Latest Updates
- Added mobile-first design
- Implemented direct camera access
- Made calibration optional
- Added touch-friendly interface
- Improved error handling
- Enhanced visual feedback
- Added responsive sizing

## Deployment
This application is deployed using GitHub Pages and can be accessed at https://martinezworldwide.github.io/WebRTC/

## Privacy
- All processing is done locally in your browser
- No images are uploaded to any server
- No data is stored or transmitted

## License
MIT License