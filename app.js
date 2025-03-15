// Global calibration variables
let isCalibrated = false;
let pixelsPerMm = null;
let calibrationObject = null;
let stream = null;

// Reference object sizes in mm
const REFERENCE_SIZES = {
    quarter: 24.26,
    penny: 19.05
};

// Default pixels per mm (used when not calibrated)
const DEFAULT_PIXELS_PER_MM = 5;

// Toggle calibration section
document.getElementById("calibrationToggle").addEventListener("click", function() {
    document.querySelector(".container").classList.toggle("calibration-active");
});

// Camera button
document.getElementById("cameraBtn").addEventListener("click", async function() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            } 
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.style.display = 'none';
        document.body.appendChild(video);
        
        video.onloadedmetadata = function() {
            video.play();
            // Take photo after a short delay to allow camera to adjust
            setTimeout(() => {
                const canvas = document.getElementById("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0);
                
                // Stop camera
                stream.getTracks().forEach(track => track.stop());
                video.remove();
                
                // Process the image
                processImage(canvas);
            }, 500);
        };
    } catch (err) {
        alert("Could not access camera. Please check permissions or use image upload instead.");
        console.error(err);
    }
});

// Event listeners for calibration
document.getElementById("referenceObject").addEventListener("change", function(e) {
    document.getElementById("customSize").style.display = 
        e.target.value === "custom" ? "block" : "none";
});

document.getElementById("calibrateBtn").addEventListener("click", function() {
    calibrationObject = document.getElementById("referenceObject").value;
    let referenceSize;
    
    if (calibrationObject === "custom") {
        referenceSize = parseFloat(document.getElementById("customSizeInput").value);
        if (!referenceSize || referenceSize <= 0) {
            alert("Please enter a valid size in millimeters");
            return;
        }
    } else {
        referenceSize = REFERENCE_SIZES[calibrationObject];
    }
    
    document.getElementById("calibrationStatus").textContent = 
        "Click on two points on your reference object to measure its diameter";
    
    startCalibration(referenceSize);
});

// Start calibration process
function startCalibration(referenceSize) {
    const canvas = document.getElementById("canvas");
    let points = [];
    let ctx = canvas.getContext("2d");
    
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        points.push({x, y});
        
        // Draw point
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        if (points.length === 2) {
            // Calculate distance
            const distance = Math.sqrt(
                Math.pow(points[1].x - points[0].x, 2) + 
                Math.pow(points[1].y - points[0].y, 2)
            );
            
            // Calculate pixels per mm
            pixelsPerMm = distance / referenceSize;
            isCalibrated = true;
            
            // Draw line between points
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Update status
            document.getElementById("calibrationStatus").textContent = 
                `Calibrated: ${referenceSize}mm = ${distance.toFixed(1)}px`;
            
            // Remove click listener
            canvas.removeEventListener("click", handleClick);
            
            // Process image again with calibration
            processImage(canvas);
        }
    }
    
    canvas.addEventListener("click", handleClick);
}

// Image upload handler
document.getElementById("imageUpload").addEventListener("change", function (event) {
    let img = new Image();
    img.src = URL.createObjectURL(event.target.files[0]);

    img.onload = function () {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        // Set canvas size to match image aspect ratio
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.6;
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        processImage(canvas);
    };
});

function processImage(canvas) {
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let thresh = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    try {
        // Convert to grayscale
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Apply Gaussian blur to reduce noise
        cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

        // Apply adaptive thresholding
        cv.adaptiveThreshold(
            blur,
            thresh,
            255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY_INV,
            11,
            2
        );

        // Find contours
        cv.findContours(
            thresh,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );

        // Calculate total image area
        let totalArea = src.rows * src.cols;
        let minArea = totalArea * 0.01;
        let maxArea = totalArea * 0.5;

        let validContours = [];
        let resultText = "No stool detected";
        let bssType = "";
        let sizeInfo = "";

        // Filter and analyze contours
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let area = cv.contourArea(contour);
            
            if (area > minArea && area < maxArea) {
                let perimeter = cv.arcLength(contour, true);
                let roundness = 4 * Math.PI * area / (perimeter * perimeter);
                
                let rect = cv.boundingRect(contour);
                let length = Math.max(rect.width, rect.height);
                let width = Math.min(rect.width, rect.height);
                let aspectRatio = length / width;
                
                validContours.push({
                    area: area,
                    contour: contour,
                    roundness: roundness,
                    length: length,
                    width: width,
                    aspectRatio: aspectRatio
                });
            }
        }

        if (validContours.length > 0) {
            validContours.sort((a, b) => b.area - a.area);
            let largest = validContours[0];
            
            // Use calibrated or default pixels per mm
            const pxPerMm = isCalibrated ? pixelsPerMm : DEFAULT_PIXELS_PER_MM;
            let lengthMm = largest.length / pxPerMm;
            let widthMm = largest.width / pxPerMm;
            
            // Classify based on shape and size
            if (largest.roundness > 0.8) {
                if (largest.aspectRatio < 1.5) {
                    bssType = "Type 1 or 2";
                    sizeInfo = "Separate hard lumps";
                }
            } else if (largest.aspectRatio > 3) {
                bssType = "Type 3 or 4";
                sizeInfo = "Snake-like/sausage shape";
            } else {
                bssType = "Type 5-7";
                sizeInfo = "Soft blobs/liquid";
            }

            // Size classification based on mm measurements
            let sizeClass;
            if (lengthMm < 30) {
                sizeClass = "Small";
            } else if (lengthMm < 50) {
                sizeClass = "Medium";
            } else {
                sizeClass = "Large";
            }

            resultText = `Size: ${sizeClass}\n` +
                        `Length: ${lengthMm.toFixed(1)}mm\n` +
                        `Width: ${widthMm.toFixed(1)}mm\n` +
                        `Bristol Scale: ${bssType}\n` +
                        `${sizeInfo}`;

            if (!isCalibrated) {
                resultText += "\n\n(Note: Measurements are approximate. Use calibration for precise measurements.)";
            }

            // Draw the detected contour and measurements
            cv.cvtColor(thresh, dst, cv.COLOR_GRAY2RGBA);
            let color = new cv.Scalar(255, 0, 0, 255);
            cv.drawContours(dst, contours, -1, color, 2);
            
            // Draw measurements
            let text = `L: ${lengthMm.toFixed(1)}mm`;
            cv.putText(dst, text, new cv.Point(10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, color, 2);
            
            cv.imshow(canvas, dst);
        } else {
            cv.imshow(canvas, src);
        }

        document.getElementById("result").innerHTML = resultText.replace(/\n/g, '<br>');
    } catch (err) {
        console.error('Error in processing:', err);
        document.getElementById("result").innerHTML = "Error processing image. Please try again.";
    } finally {
        // Clean up
        src.delete();
        dst.delete();
        gray.delete();
        blur.delete();
        thresh.delete();
        contours.delete();
        hierarchy.delete();
    }
}
