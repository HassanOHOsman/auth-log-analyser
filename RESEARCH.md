## SSH auth.log format

**What I needed to learn and why:**
I needed to know what failed SSH login lines look like so that my tool can find them and extract the IP address.

**Where I looked:**
- [Red Hat Customer Portal: SSH "Failed password" article](https://access.redhat.com/solutions/7138892)
  (official vendor source). Showed a failed login line on RHEL 9/10 with
  the same shape I planned to match. Only the first part is public.
- [LinuxSecurity.com: Understand Failed Authentication Patterns](https://linuxsecurity.com/howtos/secure-my-network/understand-failed-authentication-patterns-linux-logs)
  Showed several example lines and explained that PAM writes a separate
  line for the same attempt. A security news site, so supporting evidence.
- [Medium: Investigating SSH Authentication Failures on Linux](https://medium.com/@gozde_t/%EF%B8%8F-investigating-ssh-authentication-failures-on-linux-30ae275a0caf)
  The only source I found showing the `invalid user` variation.
- [Ubuntu: Viewing and monitoring log files](https://ubuntu.com/tutorials/viewing-and-monitoring-log-files)
  (official). Confirmed `/var/log/auth.log` records remote logins.
- [GeeksforGeeks: Find failed SSH login attempts](https://www.geeksforgeeks.org/linux-unix/find-failed-ssh-login-attempts-in-linux/)
  and [TutorialsPoint: the same topic](https://www.tutorialspoint.com/article/how-to-find-all-failed-ssh-login-attempts-in-linux)
  Confirmed log locations differ by distro and showed per-IP counting
  with `awk`.

**How I assessed them:**
Two independent sources (Red Hat and LinuxSecurity) showed the same line
shape, which is why I trusted it. None of them is a formal specification
of sshd's log messages, and the `invalid user` variation rests on one
source (Medium). To reduce that risk I wrote my own sample data covering
both shapes, and I tested my regex against it with `npm test`. 

**What I learned:**
- A failed login is recorded as `Failed password for <user> from <IP>
  port <N> ssh2`. For a user that doesn't exist, `invalid user` comes
  before the name. The IP still comes after `from` in both shapes, but
  the username moves along by two words.
- The log location depends on the distro: `/var/log/auth.log`
  (Debian/Ubuntu), `/var/log/secure` (Red Hat family), or
  `journalctl` on systemd systems. So my tool takes the file path as an
  argument instead of hardcoding it.
- One tutorial extracts the IP with `awk '{print $11}'`, which depends
  on field position. I tried it on my two sample lines: on the normal
  line it printed `203.0.113.5`, but on the `invalid user` line it
  printed `admin`, because the extra words `invalid user` shift every
  field along by two (the IP moves from field 11 to field 13). So I
  anchored my regex on `from` instead of counting positions.
- One login attempt can produce extra PAM lines
  (`pam_unix(sshd:auth): authentication failure`). My regex only matches
  `Failed password`, so these should be ignored. I haven't tested this yet.

**What didn't work:**
- I couldn't find a full real log file online because they're private,
  so I wrote my own sample data in `sample_data/auth.log`.
- My sample file didn't show up in Git. The Node `.gitignore` template
  contains `*.log`, which silently ignored it. I found the rule with
  `git check-ignore -v` and fixed it with `!sample_data/auth.log`
  instead of removing the `*.log` rule.



## Regular expressions in JavaScript

**What I needed to learn and why:**
I needed a regex in `parseLine` to find failed login lines and pick out the IP address.
  
**Where I looked:**
- [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) (official documentation for JavaScript). 

**What I learned:**
- `( )` is a capture group that saves part of the match, and `(?: )` matches text without saving it. A `?` after a group makes it optional.
- `\S+` matches one or more non-space characters, and `\d{1,3}` matches one to three digits.
- `line.match(regex)` returns an array of the captured parts, or `null` if the line doesn't match. That's why `parseLine` returns `null` for other lines.


**What didn't work:**
- My first regex had no optional group, so it matched only 6 of the 11 failed logins. Nothing crashed and the `invalid user` lines were just skipped. I found it by counting the output against the sample file, and fixed it by adding `(?:invalid user )?`.



## Reading a file and counting in Node.js

**What I needed to learn and why:**
My tool had to read a log file line by line, take the file path from the command line, and count failed logins per IP address.

**Where I looked:**
- [Node.js docs: readline](https://nodejs.org/api/readline.html) and [fs](https://nodejs.org/api/fs.html). 
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). 

**What I learned:**
- `readline` with `for await` reads a file one line at a time instead of loading it all at once, and `await` only works inside an `async` function. That's why `main` is `async`.
- `process.argv[2]` is the first argument the user types, because positions 0 and 1 are Node and the script.
- A `Map` stores one count per IP address. `has` checks if an IP was seen, `get` reads its count, and `set` stores the new total.
- `console.error` prints to the error stream, and `process.exit(1)` stops the program with a failure code.

**What didn't work:**
- My first file-exists check was written as `fs.existsSync(!filePath)`, which tests a true/false value and not the path, so it never caught a missing file. I fixed it to `!fs.existsSync(filePath)` and gave it its own error message, and I tested it with a file that doesn't exist.
