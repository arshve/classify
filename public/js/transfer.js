let featureExtractor;
let classifier;
let loss;
let addBtn;
let train;
let predict;
let input;
let video = document.querySelector("#videoStream");

let option = {
  learningRate: 0.0001,
  hiddenUnits: 100,
  epochs: 25,
  numClasses: 0,
  batchSize: 16
  // BatchSize 16,32,64,128,256
};

// Function Object for Setting
function lRate(val) {
  option.learningRate = parseFloat(val);
  console.log(option);
}
function epoch(val) {
  option.epochs = parseInt(val);
  console.log(option);
}
function batchSize(val) {
  option.batchSize = parseInt(val);
  console.log(option);
}
function numClass() {
  option.numClasses++;
  document.getElementById("class").innerHTML = option.numClasses;
  console.log(option);
}

document.getElementById("lr").value = option.learningRate;
document.getElementById("epoch").value = option.epochs;
document.getElementById("batch").value = option.batchSize;

var timeleft = 10;
var downloadTimer = setInterval(function() {
  document.getElementById("countdown").innerHTML =
    "<span style='color:red; font-size:15px;'>" + timeleft + "</span> seconds";
  timeleft -= 1;
  if (timeleft <= 0) {
    clearInterval(downloadTimer);
    document.getElementById("set").innerHTML =
      "<span style='color:#6e6e6e'>Setting</span>";
    document.getElementById("countdown").innerHTML =
      "<span style='color:#6e6e6e'>has been Setup and <span style='color:red; font-size: 12px;'> can't be change </span> anymore</span>";
  }
}, 1000);
function setup() {
  noCanvas();
  // Timeout for setting change
  setTimeout(() => {
    // Extract PreTrain features from MobileNet
    featureExtractor = ml5.featureExtractor("MobileNet", option, modelReady);
    // Create a new classifier using those features and give the video we want to use
    classifier = featureExtractor.classification(video, vidReady);
  }, 10000);

  setupButtons();
}

//Element STATUS
// model
function modelReady() {
  select("#modelStatus").html("Base Model (MobileNet) loaded!");
  select("#modelStatus").style("color", "#fff");
}

// camera
function vidReady() {
  select("#videoStatus").html("Video Ready!");
  select("#videoStatus").style("color", "#fff");
}

// Classify the Trained Model
function classify() {
  classifier.classify(gotResults);
  select("#result").style("font-size", "3em");
}

// BUTTON FUNCTION for All Utilitys
function setupButtons() {
  let info = select("#info");
  let img = 0;
  addBtn = select("#addBtn");
  addBtn.mouseClicked(function() {
    let num = 0;
    if (select("#className").value() == "" || img >= option.numClasses) {
      alert("Masukan Nama Objek / Jumlah Objek Sudah Penuh");
    } else {
      info.html("Click to add images!");
      let className = select("#className").value();
      let imgItems = select(".imgItems");
      let imgItem = createElement("div").addClass("imgItem noselect");
      imgItem.parent(imgItems);
      let itemName = createElement("h3", className).addClass("itemName");
      itemName.parent(imgItem);
      let imgNum = createElement("span", num).addClass("num");
      imgNum.parent(imgItem);
      img++;
      select("#className").value("");
      imgItem.parent(imgItems).mouseClicked(function() {
        num++;
        classifier.addImage(className);
        imgNum.html(num);
      });
    }
  });

  // Train Button
  train = select("#train");
  train.mousePressed(function() {
    let ls = 0;
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select("#loss").html("Loss: " + loss);
        console.log("E " + ls + ". " + loss);
        ls++;
      } else {
        select("#loss").html(
          "Done Training! Final Loss: <span style='color: red;background-color: #3e3f42'>" +
            loss +
            "</span>"
        );
        select("#more").html(
          "Press <span style='color: red'>F12</span> to see loss / epoch"
        );
      }
    });
  });

  // Predict Button
  buttonPredict = select("#predict");
  buttonPredict.mousePressed(classify);

  // Save model
  saveBtn = select("#save");
  saveBtn.mousePressed(function() {
    classifier.save();
  });
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  if (result) {
    select("#result").html(result);
    classify();
  }
}
