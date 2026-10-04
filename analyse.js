const fs = require("fs");
const readline = require("readline");

const FAILED_LOGIN = /Failed password for (?:invalid user )?(\S+) from (\d{1,3}(?:\.\d{1,3}){3}) port/;

const THRESHOLD = 3;

function parseLine(line) {
    const match = line.match(FAILED_LOGIN);
    if (!match) return null;
    return {ip: match[2] };
}

async function main() {
   const filePath = process.argv[2];

   if (!filePath) {
    console.error("Usage: node analyse.js <path-to-log-file>");
    process.exit(1);
   }

   if(!fs.existsSync(filePath)) {
    console.error("Error: file not found: " + filePath);
    process.exit(1);
   }

   const rl = readline.createInterface({
     input: fs.createReadStream(filePath),
   });

   const failuresByIp = new Map();

   for await (const line of rl) {
    const result = parseLine(line);

    if(result) {

        const ip = result.ip;
        if (!failuresByIp.has(ip)) {
            failuresByIp.set(ip, 1);
        } else {
            const currentCount = failuresByIp.get(ip);
            failuresByIp.set(ip, currentCount + 1);
        }
    }
   }
  

   for (const entry of failuresByIp) {
    const ip = entry[0];
    const count = entry[1];
    
    if (count >= THRESHOLD) {
        console.log("🚨 WARNING: IP address " + ip + " is associated with " + count + " failed login attempts.");
    } else {
        console.log("✅ OK: IP address " + ip + " is associated with " + count + " failed login attempts.");
    }

   }

}

main();