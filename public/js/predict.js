let mobilenet;
let classifier;

// Camera Setting
let video = document.querySelector("#videoStream");

function setup() {
  noCanvas();

  // Extract PreTrain features from MobileNet
  mobilenet = ml5.featureExtractor("MobileNet", modelReady);

  // Create a new classifier using those features and give the video we want to use
  classifier = mobilenet.classification(video, videoReady);

  // Button Setting
  setupButtons();
}

// Classify Train Test
function classify() {
  classifier.classify(gotResults);
  select("#result").style("font-size", "3em");
}

// A util function to create UI buttons
function setupButtons() {
  // Load Button
  loadBtn = select("#loadBtn");
  loadBtn = loadBtn.changed(function() {
    select("#modelStatus").html("Custom Model Loaded!");
    select("#modelStatus").style("color", "#fff");
    select(".labelBtn").html("Click Here to Load Another Model...");
    classifier.load(loadBtn.elt.files, function() {
      select("#modelStatus").html("Custom Model Loaded!");
      console.log("loaded");
    });
  });

  // Predict Button
  buttonPredict = select("#predict");
  buttonPredict.mousePressed(classify);
}

// Model Ready
function modelReady() {
  select("#modelStatus").html("Waiting for Model");
}

// camera
function videoReady() {
  select("#videoStatus").html("Video ready!");
  select("#videoStatus").style("color", "#fff");
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
    alert("Please Load The Model!");
  }
  if (result) {
    select("#result").html(result);
    classify();
  }
}
