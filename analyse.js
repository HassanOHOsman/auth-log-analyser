const fs = require("fs");
const readline = require("readline");

async function main() {
   const filePath = process.argv[2];
   console.log(`Reading ${filePath}`);
   
   const rl = readline.createInterface({
     input: fs.createReadStream(filePath),
   });
}