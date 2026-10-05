const test = require("node:test");
const assert = require("node:assert");

const { parseLine } = require("../analyse.js");

test("parseLine should return the IP address for a failed login attempt", () => {
    const logLine = "Oct  3 14:22:10 myserver sshd[12345]: Failed password for john from 203.0.113.5 port 54321 ssh2";
    const result = parseLine(line);
    assert.strictEqual(result, { ip: "203.0.113.5" });
});

