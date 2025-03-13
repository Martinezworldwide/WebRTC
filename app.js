document.getElementById("imageUpload").addEventListener("change", function (event) {
    let img = new Image();
    img.src = URL.createObjectURL(event.target.files[0]);

    img.onload = function () {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        processImage(canvas);
    };
});

function processImage(canvas) {
    let src = cv.imread(canvas);
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    let thresh = new cv.Mat();
    cv.threshold(gray, thresh, 100, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let resultText = "No bowel movement";
    let maxArea = 0;

    for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i);
        let area = cv.contourArea(contour);

        if (area > maxArea) {
            maxArea = area;
        }
    }

    // Classify stool size
    if (maxArea < 1000) {
        resultText = "Small";
    } else if (maxArea >= 1000 && maxArea < 5000) {
        resultText = "Medium";
    } else if (maxArea >= 5000) {
        resultText = "Large";
    }

    document.getElementById("result").innerText = `Detected stool size: ${resultText}`;

    src.delete();
    gray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
}
