// Node Module
var express = require("express"),
  app = express();

// Config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));

// Route
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/transfer", function(req, res) {
  res.render("transfer");
});

app.get("/predict", function(req, res) {
  res.render("predict");
});

// Server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("Server Running at Port 3000");
});
