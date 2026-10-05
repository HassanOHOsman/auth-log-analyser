# AI Usage

## Tools used and what for

I used Claude to:
- Helped me navigate certain challenges while building the analyser tool, such as troubleshooting terminal errors, getting unstuck, and implementing if conditions to handle cases where a file path is not provided and when the specified file is missing.
- Generate sample log lines.
- Better form the regex used in the parseLine function.
- Explain some concepts, such as regex groups, Map, and require.main.
- Help me improve the readability and structure of RESEARCH.md, README.md, and AI.md.


## Incorrect or unhelpful suggestions

- The file containing the sample log lines was ignored by Git. First, Claude suggested that the Node .gitignore shouldn't affect it, then corrected itself and pointed to `*.log`. I confirmed the cause with `git check-ignore -v`.

- For test assertions, Claude suggested that I could use either strictEqual or deepStrictEqual. I then wrote my first assertion with `strictEqual`, ran it, and saw it fail even though the `actual` and the `expected` results were identical. This led me to assert using `deepStrictEqual` which passed.


## How I verified the suggestions

- I ran the program after every step and compared the output with the sample log lines file.
- I verified the IP address count with with `grep` command line.
- The first version of the regex matched only 6 out of 11 failed login attempts. I found the problem by counting the output, and fixed it.
- I wrote 3 tests for parseLine function and ran them with `npm test`.
- I compared the log format across several sources and noted how far I trusted each one in RESEARCH.md.