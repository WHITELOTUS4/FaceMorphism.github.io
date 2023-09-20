const video = document.getElementById("video");
const isScreenSmall = window.matchMedia("(max-width: 900px)");
let predictedAges = [];


Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/FaceMorphism.github.io/Src/weights"),
  faceapi.nets.tinyFaceDetector.loadFromUri("/FaceMorphism.github.io/Src/weights"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/FaceMorphism.github.io/Src/weights"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/FaceMorphism.github.io/Src/weights"),
  faceapi.nets.faceExpressionNet.loadFromUri("/FaceMorphism.github.io/Src/weights"),
  faceapi.nets.ageGenderNet.loadFromUri("/FaceMorphism.github.io/Src/weights")
]).then(startWebcam);
// Promise.all([
//   faceapi.nets.ssdMobilenetv1.loadFromUri("/src/weights"),
//   faceapi.nets.tinyFaceDetector.loadFromUri("/src/weights"),
//   faceapi.nets.faceLandmark68Net.loadFromUri("/src/weights"),
//   faceapi.nets.faceRecognitionNet.loadFromUri("/src/weights"),
//   faceapi.nets.faceExpressionNet.loadFromUri("/src/weights"),
//   faceapi.nets.ageGenderNet.loadFromUri("/src/weights")
// ]).then(startWebcam);


function startWebcam(){
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
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


function getLabeledFaceDescriptions(){
  const labels = [];
  for(let i=0; i<kilometer-1; i++){
    labels[i] = data[i].name;
  }
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./assets/${label}/${i}.jpg`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  document.getElementById("access").innerHTML='&#10003;';
  document.querySelector(".btnHolder").style.opacity = "0.0";

  const canvas = faceapi.createCanvasFromMedia(video);
  let container = document.querySelector(".container");
  container.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    document.getElementById("name").innerHTML = results[0].label;
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      drawBox.draw(canvas);
    });
  }, 10);
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
      for(i=0; i<kilometer-1; i++){
        if(document.getElementById("name").innerHTML == data[i].name){
          document.getElementById("id").innerText = data[i].code;
        }
      }
    }
  }, 100);
});

function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge = predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
}

setInterval(function onn(){
  console.clear();
  if((document.getElementById("gender").innerHTML != 'loading..') || ((document.getElementById("name").innerHTML != 'loading..'))){
    document.getElementById("founder").style.display="none";
    document.getElementById("method").innerText="Compiling..";
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
    document.getElementById("method").innerText="Scanning..";
  }
},10000);
setTimeout(() =>{
  if(document.getElementById("access").innerHTML=='&#10003;'){
    alert("Please give the access of your webcam to detect your face...");
    alert("If you not know that how to give access camera then visit out Docs");
  }
},10000);