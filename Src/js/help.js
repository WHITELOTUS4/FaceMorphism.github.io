const video = document.getElementById("video");
const isScreenSmall = window.matchMedia("(max-width: 900px)");
let predictedAges = [];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/src/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/src/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/src/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/src/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/src/models")
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}
function screenResize(isScreenSmall) {
  if (isScreenSmall.matches) {
    // If media query matches
    video.style.width = "320px";
  } else {
    video.style.width = "500px";
  }
}

screenResize(isScreenSmall); // Call listener function at run time
isScreenSmall.addListener(screenResize);

video.addEventListener("playing", () => {
  // console.log("playing called");
  const canvas = faceapi.createCanvasFromMedia(video);
  let container = document.querySelector(".container");
  container.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // console.log(resizedDetections);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    if (resizedDetections && Object.keys(resizedDetections).length > 0) {
      const age = resizedDetections.age;
      const interpolatedAge = interpolateAgePredictions(age);
      const gender = resizedDetections.gender;
      const expressions = resizedDetections.expressions;
      const maxValue = Math.max(...Object.values(expressions));
      const emotion = Object.keys(expressions).filter(
        item => expressions[item] === maxValue
      );
      document.getElementById("age").innerHTML = `${interpolatedAge.toFixed(1)} <o>${interpolatedAge<=10?"&#x1f476;":interpolatedAge<=25?"&#x1f466;":interpolatedAge<=55?"&#x1f468;":interpolatedAge<=90?"&#x1f474;":"&#x1f47b;"}</o>`;
      document.getElementById("gender").innerHTML = `${gender} <o>${gender=='male'?"&#x2642;":gender=='female'?"&#x2640;":"?"}</o>`;
      document.getElementById("emotion").innerHTML = `${emotion[0]} <o>${emotion=='happy'?"&#x1f604;":emotion=='sad'?"&#x1f614;":emotion=='neutral'?"&#x1f610;":emotion=='angry'?"&#x1f620;":"&#x1f622;"}</o>`;
    }
  }, 10);
});

function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge = predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
}

setInterval(function onn(){
  // console.clear();
  if(document.getElementById("gender").innerHTML != 'loading..'){
    document.getElementById("founder").style.display="none";
    setTimeout(() => {
      if(document.getElementById("name").innerHTML == 'loading..'){
        document.getElementById("name").innerHTML = 'Face Matcher Engine not found!';
      }
    },100);
  }else{
    document.getElementById("founder").style.display="block";
  }
},1000);
setTimeout(function off(){
  if(document.getElementById("gender").innerHTML == 'loading..'){
    document.getElementById("founder").innerHTML = `<h1>Face not found!</h1>`;
  }
},4000);