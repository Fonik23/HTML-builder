const fsPromises = require("fs/promises");
const path = require("path");



const getCssFiles = async (dir = __dirname, extension = ".css")  => {
  const bundlePath = path.join(__dirname + "/project-dist", "bundle.css")
  const stylesPath = path.join(__dirname, "styles")

  fsPromises.access(bundlePath, fsPromises.constants.F_OK)
    .then(() => fsPromises.unlink(bundlePath))
    .catch((error) => {})
    .then(() => fsPromises.readdir(stylesPath, {withFileTypes: true}))
    .then((files) => {
      files.map((file) => {
        const pathToFile = path.join(stylesPath, file.name)
        return fsPromises.stat(pathToFile)
        .then((stats) => {
          if (stats.isFile() && path.extname(file.name) === extension) {
            fsPromises.readFile(pathToFile, {encoding: "utf8"})
              .then((content) => fsPromises.writeFile(bundlePath, content, {encoding: "utf8", flag: "a"}))
          }
        })
      })
    })
}

getCssFiles()