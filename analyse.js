const fs = require("fs");
const readline = require("readline");

const FAILED_LOGIN = /Failed password for (\S+) from (\d{1,3}(?:\.\d{1,3}){3}) port/;

function parseLine(line) {
    const match = line.match(FAILED_LOGIN);
}

async function main() {
   const filePath = process.argv[2];

   const rl = readline.createInterface({
     input: fs.createReadStream(filePath),
   });

   for await (const line of rl) {
    if (line.includes("Failed password")) {
       console.log(line); 
    }
   
   }

}

main();