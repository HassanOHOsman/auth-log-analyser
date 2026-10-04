const fs = require("fs");
const readline = require("readline");

const FAILED_LOGIN = /Failed password for (?:invalid user )?(\S+) from (\d{1,3}(?:\.\d{1,3}){3}) port/;

const THRESHOLD = 3;

function parseLine(line) {
    const match = line.match(FAILED_LOGIN);
    if (!match) return null;
    return { user: match[1], ip: match[2] };
}

async function main() {
   const filePath = process.argv[2];

   const rl = readline.createInterface({
     input: fs.createReadStream(filePath),
   });

   const failuresByIp = new Map();

   for await (const line of rl) {
    const result = parseLine(line);

    if(result) {
        console.log(result);

        const ip = result.ip;
        if (!failuresByIp.has(ip)) {
            failuresByIp.set(ip, 1);
        } else {
            const currentCount = failuresByIp.get(ip);
            failuresByIp.set(ip, currentCount + 1);
        }
    }
   }
   console.log(failuresByIp);

   for (const entry of failuresByIp) {
    const ip = entry[0];
    const count = entry[1];
    console.log("IP address: " + ip + " is associated with " + count + " failed login attempts");

    if (count >= THRESHOLD) {
        console.log("WARNING: IP address " + ip + " has " + count + " failed login attempts");
    }

   }

}

main();