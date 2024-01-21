const fs = require("fs");
const path = require("path");
const { stdout } = process;

const pathToFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  if(err) return;
  files.forEach((element) => {
    if (element.isFile()) {
      const pathToElement = path.join(pathToFolder, element.name)
      fs.stat(pathToElement, (err, stats) => {
        if (err) return;
        const checkExtension = element.name.startsWith('.') ? element.name.slice(1) : path.extname(element.name).slice(1)
        stdout.write(`${element.name.slice(0, element.name.lastIndexOf("."))} - ${checkExtension} - ${stats.size}\n`)
      })
    } else if (element.isDirectory()){
      const pathToSubFolder = path.join(pathToFolder, element.name)
      fs.readdir(pathToSubFolder, {withFileTypes: true}, (err, files) => {
        if (err) return;
        files.forEach((subElement) => {
          if (subElement.isFile()) {
            const pathToElement = path.join(pathToSubFolder, subElement.name)
            fs.stat(pathToElement, (err, stats) => {
              if (err) return;
              const checkExtension = subElement.name.startsWith('.') ? subElement.name.slice(1) : path.extname(subElement.name).slice(1)
              stdout.write(`${subElement.name.slice(0, subElement.name.lastIndexOf("."))} - ${checkExtension} - ${stats.size}\n`)
            })
          }
        })
      })
    }
  })
})

