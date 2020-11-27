var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');
const express = require('express');
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

const MIME_TYPE_MAP = {
 	  "application/json" : "json"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

var upload = multer({ storage : storage});
app.post("/",upload.single("json"), (req, res, next) => {
  const post = req.body;
     const url = req.protocol + "://" + req.get("host");
	var imagepath = (url + "/images/" + req.files[0].filename);
  console.log(req.file);
  res.status(201).json({
path :  imagepath
  });
});

app.get("/", (req, res, next) => {
	res.send("welcome to express");
	  });

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
