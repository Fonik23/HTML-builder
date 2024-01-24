
//// ----------------------------- шаблон встает криво

const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");


const getTemplate = async () => {
  const template = await fsPromises.readFile(path.join(__dirname, "template.html"), {encoding: "utf-8"});
  return template;
}

const getComponents = async () => {
  try {
    let components = {};
    await fsPromises.readdir(path.join(__dirname, "components"))
      .then((files) => {
        files.map((file) => {
          const fileName = file.slice(0, file.lastIndexOf(".html"))
          components[fileName] = file
        })
    })
    return components;
  } catch (err) {
    throw err;
  }
}

const createFolder = async () => {
  const projectDist = await fsPromises.mkdir(path.join(__dirname, "project-dist"), {recursive: true});
  return projectDist;
}

const addComponents = async () => {
  try {
    let components = await getComponents()
    let template = await getTemplate()
    for (let key in components) {
      const reg = new RegExp (`{{${key}}}`)
      if (reg.test(template)) {
        const currentPath = path.resolve(__dirname, "components", components[key])
          const content = await fsPromises.readFile(currentPath, {encoding: "utf-8"});
          template = template.replace(reg, content)
      }
    }
    return await fsPromises.writeFile(path.resolve(__dirname, "project-dist", "index.html"), template)
  } catch (err) {
    throw err
  }
}

const copyAssets = async () => {
  const assetsPath = path.join(__dirname, "assets")
  const assetsCopy = path.resolve(__dirname, "project-dist", "assets")
  try {
    await fsPromises.mkdir(assetsCopy,{recursive: true});
    const toCopy = fsPromises.readdir(assetsPath, {withFileTypes: true})
      .then ((files) => {
        files.forEach((file) => {
          if (file.isDirectory()) {
            fsPromises.mkdir(path.resolve(__dirname, assetsCopy, file.name), {recursive: true})
              .then (() => {
                fsPromises.readdir(path.resolve(__dirname, assetsPath, file.name), {withFileTypes: true})
                  .then((innerFiles) => {
                    innerFiles.forEach((innerFile) => {
                      const src = path.resolve(__dirname, assetsPath, file.name, innerFile.name)
                      const dest = path.resolve(__dirname, assetsCopy, file.name, innerFile.name)
                      fsPromises.copyFile(src, dest)
                    })
                  })
              })
          }
        })
      })

  } catch (err){
    throw err
  }

  
  
}

const getCssFiles = async (dir = __dirname, extension = ".css")  => {
  const bundlePath = path.join(__dirname + "/project-dist", "style.css")
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

(async () => {
  try {
    await createFolder();
    await addComponents();
    await copyAssets();
    await getCssFiles();
  } catch (err) {
    throw err;
  }
})()


