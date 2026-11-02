#!/usr/bin/env bash
# Close unstructured batch-1 issues #28-77 at once (parallel), keep #78+ (structured per-project).
set -uo pipefail
REPO="jaikaran109/51_Web_Projects"
LOG="c:/Users/Lenovo/OneDrive/Desktop/51_Web_Projects/scripts/close-batch1.log"
: > "$LOG"
seq 28 77 | xargs -P 8 -I{} gh issue close {} --repo "$REPO" --reason "not planned" --comment "Closing: unstructured generic issue. Replaced by structured per-project issues #78-#127 (each titled [NN-Project] with folder link + exact file/line). Pick one of those instead." >> "$LOG" 2>&1
echo "--- done, tail: ---" >> "$LOG"
gh issue list --repo "$REPO" --state open --limit 200 --json number --jq length >> "$LOG" 2>&1
cat "$LOG"
