#!/usr/bin/env python3
"""Serve the portable DAL game on loopback using only the Python standard library.
by JF_Li@FD & Sol
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import sys
import threading
import webbrowser


def main():
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, 'reconfigure'):
            stream.reconfigure(encoding='utf-8', errors='replace')
    parser = argparse.ArgumentParser(description='DAL / 大夏 · 学术浮生 / by JF_Li@FD & Sol')
    parser.add_argument('--port', type=int, default=5173, help='本机端口；0 表示自动选择可用端口。默认5173。')
    parser.add_argument('--no-browser', action='store_true', help='仅启动本地服务，不自动打开浏览器。')
    parser.add_argument('--check', action='store_true', help='检查便携包是否完整后退出。')
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error('--port 必须为0到65535之间的整数。')
    dist = Path(__file__).resolve().parent / 'dist'
    required = ['index.html', 'assets/campus.glb', 'assets/laboratory.glb', 'assets/conference.glb', 'assets/classroom.glb']
    missing = [name for name in required if not (dist/name).is_file()]
    if missing:
        print('游戏文件不完整：' + '、'.join(missing), file=sys.stderr)
        print('请完整解压 DAL 的 portable.zip 下载包，再从解压后的文件夹启动。', file=sys.stderr)
        print('源码开发者需要先在仓库根目录构建 dist；便携下载包无需 npm。', file=sys.stderr)
        return 1
    if args.check:
        print('DAL 便携包检查通过。by JF_Li@FD & Sol')
        return 0
    handler = partial(SimpleHTTPRequestHandler, directory=str(dist))
    changed_port = False
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    except OSError as original:
        if args.port == 0:
            print(f'无法启动本机服务：{original}', file=sys.stderr)
            return 1
        try:
            server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
            changed_port = True
        except OSError as error:
            print(f'无法启动本机服务：{error}', file=sys.stderr)
            return 1
    server.daemon_threads = True
    address = f'http://127.0.0.1:{server.server_port}/'
    print('\n  DAL · 大夏 · 学术浮生')
    print('  by JF_Li@FD & Sol')
    print(f'\n  游戏地址：{address}')
    if changed_port:
        print('  默认端口正在使用，已选择另一个本机端口。继续旧存档时请使用原地址，或导入备份。')
    print('  保持此窗口打开。在此窗口按 Ctrl+C 可结束服务。\n', flush=True)
    if not args.no_browser:
        opener = threading.Timer(.5, lambda: webbrowser.open(address))
        opener.daemon = True
        opener.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  校园暂时安静下来。下次见。')
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
