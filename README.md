# Stool Size Detection Web App

A mobile-friendly web application for analyzing and measuring stool size using computer vision technology.

## 🌟 Key Features

- 📱 **Advanced Mobile Camera Integration**
  - WebRTC-powered camera handling for better performance
  - Automatic back camera detection and selection
  - Proper orientation handling on mobile devices
  - Real-time camera preview with low latency

- 📏 **Accurate Measurements**
  - Optional calibration using common reference objects
  - Support for custom size references
  - Real-time size calculations in millimeters
  - Bristol Stool Scale classification

- 🔍 **Smart Detection**
  - Advanced color analysis to reduce false positives
  - Intelligent shape recognition
  - Water detection to avoid misclassification
  - Automatic size classification (Small/Medium/Large)

- 🛡️ **Privacy First**
  - All processing happens locally in your browser
  - No images are uploaded or stored
  - No external server communication
  - Completely offline capable

## 📱 Mobile Features

- Optimized for smartphones and tablets
- Automatic camera orientation adjustment
- Touch-friendly interface
- Responsive design for all screen sizes
- Support for both front and back cameras
- Efficient memory usage for mobile devices

## 🚀 Quick Start

1. Open the web app in your mobile browser
2. Choose between:
   - 📸 Take Photo: Opens camera with live preview
   - 📤 Upload Image: Select from your gallery
3. Optional: Calibrate using a reference object (quarter/penny)
4. View results including:
   - Size classification
   - Length and width measurements
   - Bristol Scale type
   - Shape analysis

## 📏 Measurement Options

### Quick Measurement
- Use without calibration for approximate sizes
- Automatic size classification
- Basic measurements in millimeters

### Precise Measurement
1. Click "Optional Calibration"
2. Select a reference object (quarter/penny) or enter custom size
3. Mark two points on the reference object
4. Get precise measurements calibrated to your image

## 🔧 Technical Details

- **Technologies Used**
  - WebRTC for advanced camera handling
  - OpenCV.js for image processing
  - Pure JavaScript (No frameworks required)
  - HTML5 Canvas for rendering

- **Browser Support**
  - Chrome (Recommended for best camera support)
  - Firefox
  - Safari
  - Edge

## 🆕 Latest Updates

- Added WebRTC implementation for better camera handling
- Improved mobile device orientation support
- Enhanced color analysis to reduce false positives
- Added water detection to prevent misclassification
- Optimized performance for mobile devices
- Improved error handling and user feedback

## 🔒 Privacy

This application processes all images locally in your browser. No images or data are ever uploaded to any server. The app can work completely offline after initial load.

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.