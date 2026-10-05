# auth-log-analyser

A command-line tool that scans SSH authentication logs, looking for failed login attempts, counts them per IP address, and flags the ones that reach (or exceed) a threshold of 3 failed login attempts.


## How to run it

You only need [Node.js](https://nodejs.org) installed.

Run the analyser on the sample log:

```bash
node analyse.js sample_data/auth.log
```

Run the tests:

```bash
npm test
```

## How it works

1. The analyser reads the log file one line at a time.
2. It uses a regex (in the `parseLine` function) to find failed login lines and pick out the IP address.
3. It counts the failed login attempts for each IP address.
4. It then prints one line per IP address, and flags any IP at or above the threshold.

