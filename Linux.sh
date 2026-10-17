#!/bin/sh
# DAL / by JF_Li@FD & Sol
cd -- "$(dirname -- "$0")" || exit 1
for dal_python in python3 python; do
  if command -v "$dal_python" >/dev/null 2>&1 && "$dal_python" -c 'import sys; sys.exit(sys.version_info < (3, 8))' >/dev/null 2>&1; then
    exec "$dal_python" run_game.py "$@"
  fi
done
printf 'Python 3.8+ is required. Install Python 3 using your Linux package manager, then run ./Linux.sh again.\n' >&2
exit 1
