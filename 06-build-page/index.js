
//// -----------------------------Assets не копируется, шаблон встает криво

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

const copyAssets = () => {
  const assetsPath = path.join(__dirname, "assets")
  const assetsCopy = path.resolve(__dirname, "project-dist", "assets")


  fsPromises.mkdir(assetsCopy, {recursive: true})

  fsPromises.readdir(assetsPath, {withFileTypes: true})
  .then((files) => {
    files.map((file) => {
      const src = path.join(assetsPath, file.name)
      const dest = path.join(assetsCopy, file.name)
      fsPromises.copyFile(src, dest)
    })
  })
  
}

const getCssFiles = async (dir = __dirname, extension = ".css")  => {
  const bundlePath = path.join(__dirname + "/project-dist", "style.css")
  fsPromises.access(bundlePath, fsPromises.constants.F_OK)
    .then(() => fsPromises.unlink(bundlePath))
    .catch((error) => {})
    .then(() => fsPromises.readdir(dir, {withFileTypes: true}))
    .then((files) => {
      files.map((file) => {
        const pathToFile = path.join(dir, file.name)
          return fsPromises.stat(pathToFile)
        .then((stats) => {
          if(stats.isDirectory()) {
            return getCssFiles(pathToFile, extension)
          }
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
    // await copyAssets();
    await getCssFiles();
  } catch (err) {
    throw err;
  }
})()


