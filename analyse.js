const fs = require("fs");
const readline = require("readline");

async function main() {
   const filePath = process.argv[2];

   const rl = readline.createInterface({
     input: fs.createReadStream(filePath),
   });

   for await (const line of rl) {
    console.log(line);

   }


}