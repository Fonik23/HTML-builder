const fsPromises = require("fs/promises");
const path = require("path");


const pathToCopyFolder = path.join(__dirname, "files-copy");
const pathToFiles = path.join(__dirname, "files")

fsPromises.mkdir(pathToCopyFolder, {recursive: true})
  .then(() => fsPromises.readdir(pathToCopyFolder, {withFileTypes: true}))
  .then((files) => {
    if (files.length === 0) return;
    files.map((file) => fsPromises.unlink(path.join(pathToCopyFolder, file.name)))
  })
  .then (() => {
    fsPromises.readdir(pathToFiles, {withFileTypes: true})
  .then((files) => {
    files.map((file) => {
      const src = path.join(pathToFiles, file.name)
      const dest = path.join(pathToCopyFolder, file.name)
      fsPromises.copyFile(src, dest)
    })
  })
  })



  