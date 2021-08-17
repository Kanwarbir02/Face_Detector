const video = document.getElementById("Video");

//All The models for face detections
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo)

//Startvideo Funstion
function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)

    )
}

video.addEventListener("play", function(){

    // Creating The Canvas for face detections in video
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas)

    //Display Size to be used for canvas box
    const videoDisplaySize = { width: video.width, height: video.height};


    faceapi.matchDimensions(canvas, videoDisplaySize)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        console.log(detections);

        const resizedDetections = faceapi.resizeResults(detections, videoDisplaySize);

        //Clearing Canvas off the screen
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        //For Drawing the detection boxes
        faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 1000);
})