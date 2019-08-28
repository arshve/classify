let featureExtractor;
let classifier;
let loss;
let addBtn;
let train;
let predict;
let input;
let video = document.querySelector("#videoStream");

const option = {
  learningRate: 0.0001,
  hiddenUnits: 100,
  epochs: 20,
  numClasses: 4,
  batchSize: 0.4
};

function setup() {
  noCanvas();
  // Extract PreTrain features from MobileNet
  featureExtractor = ml5.featureExtractor("MobileNet", option, modelReady);

  // Create a new classifier using those features and give the video we want to use
  classifier = featureExtractor.classification(video, vidReady);

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
      info.html("Click the Button Bellow to add images to dataset !");
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
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select("#loss").html("Loss: " + loss);
        console.log(loss);
      } else {
        select("#loss").html("Done Training! Final Loss: " + loss);
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
