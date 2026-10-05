# auth-log-analyser

A command-line tool that scans SSH authentication logs, looking for failed login attempts. Then, it counts them per IP address and flags the ones that reaches (and exceeds) the defined threshold.