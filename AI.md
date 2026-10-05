# AI Usage

## Tools used and what for

I used Claude to:
- Help me navigative my way, at certain points while building the tool.
- Generate sample log lines.
- Better form the regex used in the parseLine function.
- Explain some concepts, such as regex groups, Map, and require.main.
- Help me improve the readability and structure of RESEARCH.md, README.md, and AI.md.


## Incorrect or unhelpful suggestions

- The file containing the sample log lines was ignored by Git. First, Claude suggested that the Node .gitignore shouldn't affect it, then corrected itself and pointed to `*.log`. I confirmed the cause with `git check-ignore -v`.

- For test assertions, clause suggested i could use either strictEqual or deepStrictEqual. I then wrote my first assertion with `strictEqual, ran it, and saw it fail even though the `actual` and the `expected` results were identical. This led me to assert using `deepStrictEqual` which passed.