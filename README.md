# auth-log-analyser

A command-line tool that scans SSH authentication logs, looking for failed login attempts, counts them per IP address, and flags the ones that reach (or exceed) a threshold of 3 failed login attempts.