const express = require("express");
const fs = require("fs");
const path = require("path");

const server = express();
const root = __dirname;
const folderIcon = "&#x1F4C1";
const fileIcon = "&#x1F5CE";

const displayFunc = (dirPath, files) => {
  let list = files.map((e) => {
      const filePath = path.join(dirPath, e);
      const isDirectory = fs.statSync(path.join(root, filePath)).isDirectory();
      const icon = isDirectory ? folderIcon : fileIcon;
      return `<li>${icon}<a href=${path.join("/", filePath)}>${e}</a></li>`;
    }).join("");
    console.log(list);
  return `
    <html>
      <head>
        <title>Dynamic File Server</title>
      </head>
      <body>
        <h1>Directory listing of files in ${root}</h1>
        <ul>
          ${list}
        </ul>
      </body>
    </html>
    `;
};

server.get("*", (req, res) => {
  const reqPath = path.join(root, req.path);
  console.log(root, req.path, reqPath,'path kya hee');

  if (!fs.existsSync(reqPath)) {
    res.status(404).send("404 Not Found");
  }

  if (fs.statSync(reqPath).isDirectory()) {
    fs.readdir(reqPath, (err, files) => {
      if (err) res.send("Internal Server Error");
      let display = displayFunc(req.path, files);
      res.send(display);
    });
  } else {
    console.log('sending');
    res.sendFile(reqPath);
  }
});

server.listen(3000, () => {
  console.log("Server running");
});