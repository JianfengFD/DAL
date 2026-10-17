#!/bin/sh
# DAL / by JF_Li@FD & Sol
cd -- "$(dirname -- "$0")" || exit 1
for dal_python in python3 python; do
  if command -v "$dal_python" >/dev/null 2>&1 && "$dal_python" -c 'import sys; sys.exit(sys.version_info < (3, 8))' >/dev/null 2>&1; then
    "$dal_python" run_game.py "$@"
    dal_status=$?
    if [ "$dal_status" -ne 0 ]; then
      printf '\n启动失败，请查看上方信息。按回车关闭。\n'
      read -r dal_reply
    fi
    exit "$dal_status"
  fi
done
printf '需要 Python 3.8 或更新版本。请从 https://www.python.org/downloads/ 安装 Python 3。\n安装后重新打开此启动器。按回车关闭。\n'
read -r dal_reply
exit 1
