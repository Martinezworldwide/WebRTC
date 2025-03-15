document.getElementById("imageUpload").addEventListener("change", function (event) {
    let img = new Image();
    img.src = URL.createObjectURL(event.target.files[0]);

    img.onload = function () {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        // Standardize image size while maintaining aspect ratio
        let maxWidth = 800;
        let maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

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
    let minArea = totalArea * 0.01; // Minimum 1% of image
    let maxArea = totalArea * 0.5;  // Maximum 50% of image

    let validContours = [];
    let resultText = "No bowel movement detected";

    // Filter and analyze contours
    for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i);
        let area = cv.contourArea(contour);
        
        // Filter out noise and too large objects
        if (area > minArea && area < maxArea) {
            // Calculate shape features
            let perimeter = cv.arcLength(contour, true);
            let roundness = 4 * Math.PI * area / (perimeter * perimeter);
            
            // Only consider objects with reasonable roundness (not too linear)
            if (roundness > 0.2) {
                validContours.push({
                    area: area,
                    contour: contour,
                    roundness: roundness
                });
            }
        }
    }

    // Classify based on valid contours
    if (validContours.length > 0) {
        // Sort contours by area
        validContours.sort((a, b) => b.area - a.area);
        let largestArea = validContours[0].area;
        
        // Calculate relative size compared to image
        let relativeSize = largestArea / totalArea;
        
        // Classification thresholds based on relative size
        if (relativeSize < 0.05) {
            resultText = "Small";
        } else if (relativeSize < 0.15) {
            resultText = "Medium";
        } else if (relativeSize < 0.3) {
            resultText = "Large";
        } else {
            resultText = "No bowel movement detected (object too large)";
        }

        // Draw the detected contour
        cv.cvtColor(thresh, dst, cv.COLOR_GRAY2RGBA);
        let color = new cv.Scalar(255, 0, 0, 255);
        cv.drawContours(dst, contours, -1, color, 2);
        cv.imshow(canvas, dst);
    } else {
        resultText = "No bowel movement detected";
        cv.imshow(canvas, src);
    }

    document.getElementById("result").innerText = `Detection Result: ${resultText}`;

    // Clean up
    src.delete();
    dst.delete();
    gray.delete();
    blur.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
}
