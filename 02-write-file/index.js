const fs = require("fs");
const {stdin, stdout, exit} = process;
const path = require("path");
const readline = require("readline")

const getPath = path.join(__dirname, "text.txt");


const askQuestion = (answer) => {
  if (answer.toLowerCase().trim() === "exit") {
    exit();
  }
  fs.appendFile(getPath, answer + "\n", (err) => err
                                                 ? stdout.write(err)
                                                 : rl.question("Type something (or type 'exit' for quit): ", askQuestion))
}

const rl = readline.createInterface({input : stdin, output : stdout });

rl.question("Type something (or type 'exit' for quit): ", askQuestion);

rl.on("SIGINT", () => {
  rl.close();
  exit();
})

process.on("exit", () => stdout.write("Goodbye"))
