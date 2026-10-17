#!/usr/bin/env python3
"""Create a minimal, npm-free DAL portable ZIP from an existing Vite dist.
by JF_Li@FD & Sol
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import queue
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from urllib.request import Request, urlopen
import zipfile

GAME = Path(__file__).resolve().parents[1]
CREDIT = 'by JF_Li@FD & Sol'
LAUNCHERS = ('macOS.command', 'Windows.bat', 'Linux.sh', 'run_game.py')
BAD_PARTS = {'node_modules', '.git', '.openai', '__pycache__', 'video', 'frames', 'work', '.aws', '.codex', '.agents'}
BAD_NAMES = {'.DS_Store', '.env', '.env.local', '.npmrc', 'credentials', 'id_rsa', 'id_ed25519'}
ALLOWED_DIST_SUFFIXES = {'.html', '.js', '.css', '.json', '.svg', '.glb', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.txt', '.woff', '.woff2', '.ttf', '.otf', '.mp3', '.ogg', '.wav'}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def dist_files():
    dist = GAME/'dist'
    must = ['index.html', 'THIRD_PARTY_NOTICES.txt', 'assets/campus.glb', 'assets/laboratory.glb', 'assets/conference.glb', 'assets/classroom.glb']
    missing = [p for p in must if not (dist/p).is_file()]
    if missing:
        raise RuntimeError('Build dist before packaging. Missing: ' + ', '.join(missing))
    files = []
    for file in sorted(dist.rglob('*')):
        if file.is_symlink(): raise RuntimeError('Symlinks are not allowed in the portable package: ' + file.name)
        if not file.is_file(): continue
        relative = file.relative_to(dist)
        if any(part in BAD_PARTS or part.startswith('.') for part in relative.parts):
            continue
        if file.name in BAD_NAMES or file.suffix.lower() not in ALLOWED_DIST_SUFFIXES:
            raise RuntimeError('Unexpected dist file; review before packaging: ' + relative.as_posix())
        files.append((file, 'dist/'+relative.as_posix()))
    if not any(name.endswith('.js') for _, name in files) or not any(name.endswith('.css') for _, name in files):
        raise RuntimeError('dist must contain compiled JavaScript and CSS assets.')
    return files


def write_member(archive, name, data, executable=False):
    stamp = datetime.now(timezone.utc).timetuple()[:6]
    info = zipfile.ZipInfo(name, date_time=stamp)
    info.create_system = 3
    info.external_attr = (0o100755 if executable else 0o100644) << 16
    info.compress_type = zipfile.ZIP_DEFLATED
    archive.writestr(info, data, compresslevel=9)


def verify_archive(path, archive_root):
    with zipfile.ZipFile(path) as archive:
        if archive.testzip(): raise RuntimeError('ZIP CRC verification failed.')
        names = archive.namelist()
        if len(names) != len(set(names)): raise RuntimeError('Duplicate ZIP paths.')
        for name in names:
            parts = PurePosixPath(name).parts
            if not parts or parts[0] != archive_root or PurePosixPath(name).is_absolute() or '..' in parts or '\\' in name:
                raise RuntimeError('Unsafe ZIP path: ' + name)
            if any(p in BAD_PARTS or p in BAD_NAMES for p in parts):
                raise RuntimeError('Excluded private/dependency/cache path entered ZIP: ' + name)
        required = set(LAUNCHERS) | {'README.md','THIRD_PARTY_NOTICES.txt','release-manifest.json','dist/index.html','dist/assets/campus.glb','dist/assets/laboratory.glb','dist/assets/conference.glb','dist/assets/classroom.glb'}
        packaged = {name[len(archive_root)+1:] for name in names}
        if not required <= packaged: raise RuntimeError('Missing required files: ' + ', '.join(sorted(required-packaged)))
        manifest = json.loads(archive.read(archive_root+'/release-manifest.json'))
        if set(manifest['files']) != packaged-{'release-manifest.json'}:
            raise RuntimeError('Release manifest does not enumerate exactly the packaged files.')
        for relative, expected in manifest['files'].items():
            payload = archive.read(archive_root+'/'+relative)
            if len(payload) != expected['bytes'] or digest(payload) != expected['sha256']:
                raise RuntimeError('Packaged bytes differ from manifest: ' + relative)
        for launcher in ('macOS.command','Linux.sh','run_game.py'):
            if not (archive.getinfo(archive_root+'/'+launcher).external_attr >> 16) & 0o111:
                raise RuntimeError('Executable permission not preserved: ' + launcher)
    return len(names), manifest


def verify_http(path, archive_root):
    """Extract the actual ZIP, serve on a random loopback port, check every dist file, stop."""
    with tempfile.TemporaryDirectory(prefix='dal-portable-verify-') as temporary:
        temp = Path(temporary)
        with zipfile.ZipFile(path) as archive:
            archive.extractall(temp)
        release = temp/archive_root
        subprocess.run([sys.executable,str(release/'run_game.py'),'--check'],check=True,capture_output=True,text=True)
        lines = queue.Queue()
        process = subprocess.Popen([sys.executable,'-u',str(release/'run_game.py'),'--port','0','--no-browser'],cwd=release,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding='utf-8',bufsize=1)
        def reader():
            for line in process.stdout:
                lines.put(line)
        threading.Thread(target=reader,daemon=True).start()
        address = None
        try:
            deadline = time.monotonic()+12
            while time.monotonic() < deadline:
                if process.poll() is not None:
                    raise RuntimeError('Portable server exited before HTTP verification.')
                try: line = lines.get(timeout=.2)
                except queue.Empty: continue
                match = re.search(r'http://127\.0\.0\.1:\d+/',line)
                if match: address = match.group(); break
            if not address: raise RuntimeError('Portable server did not announce its loopback URL.')
            count = 0
            with urlopen(address,timeout=8) as response:
                if response.status != 200 or b'<html' not in response.read().lower():
                    raise RuntimeError('Root document did not return HTTP 200 HTML.')
            for file in sorted((release/'dist').rglob('*')):
                if file.is_file():
                    route = file.relative_to(release/'dist').as_posix()
                    request = Request(address+route,method='HEAD')
                    with urlopen(request,timeout=8) as response:
                        if response.status != 200 or int(response.headers.get('Content-Length',-1)) != file.stat().st_size:
                            raise RuntimeError('HTTP asset verification failed: '+route)
                    count += 1
            return {'rootStatus':200,'staticPathsChecked':count,'allStatus':200,'browserOpened':False,'binding':'127.0.0.1 only','serverStopped':True}
        finally:
            if process.poll() is None:
                process.send_signal(signal.SIGINT)
                try: process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.terminate()
                    try: process.wait(timeout=3)
                    except subprocess.TimeoutExpired: process.kill(); process.wait(timeout=3)
            if process.stdout: process.stdout.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--version',default=json.loads((GAME/'package.json').read_text())['version'])
    parser.add_argument('--output-dir',type=Path,default=GAME/'releases')
    parser.add_argument('--verify-http',action='store_true',help='Verify the extracted package by serving all files over local HTTP, then stop.')
    args = parser.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]{0,39}',args.version):
        raise ValueError('Version must be a short filename-safe release version.')
    archive_root = 'DAL-v'+args.version
    args.output_dir=args.output_dir.expanduser().resolve();args.output_dir.mkdir(parents=True,exist_ok=True)
    output = args.output_dir/(archive_root+'-portable.zip')
    entries = {}
    for file,relative in dist_files(): entries[relative]=(file.read_bytes(),False)
    for name in LAUNCHERS:
        path=GAME/name
        if not path.is_file() or path.is_symlink(): raise RuntimeError('Missing/invalid launcher: '+name)
        entries[name]=(path.read_bytes(),name!='Windows.bat')
    readme = (GAME/'scripts'/'PORTABLE_README.md').read_text(encoding='utf-8').replace('{{VERSION}}',args.version)
    entries['README.md']=(readme.encode('utf-8'),False)
    entries['THIRD_PARTY_NOTICES.txt']=((GAME/'dist'/'THIRD_PARTY_NOTICES.txt').read_bytes(),False)
    for name in ('LICENSE','LICENSE.txt','LICENSE.md'):
        if (GAME/name).is_file(): entries[name]=((GAME/name).read_bytes(),False)
    manifest={'product':'DAL / Daxia Academic Life / 大夏学术浮生','version':args.version,'creator':CREDIT,'buildTimeUTC':datetime.now(timezone.utc).isoformat(),'runtime':'Python 3.8+ standard library and a modern browser','files':{name:{'bytes':len(data),'sha256':digest(data)} for name,(data,_)in sorted(entries.items())}}
    entries['release-manifest.json']=(json.dumps(manifest,ensure_ascii=False,indent=2).encode('utf-8')+b'\n',False)
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9,strict_timestamps=False) as archive:
        for name,(data,executable) in sorted(entries.items()): write_member(archive,archive_root+'/'+name,data,executable)
    count,_=verify_archive(output,archive_root)
    checksum=digest(output.read_bytes())
    output.with_suffix('.zip.sha256').write_text(checksum+'  '+output.name+'\n',encoding='ascii')
    report={'file':output.name,'version':args.version,'archiveRoot':archive_root,'files':count,'bytes':output.stat().st_size,'sha256':checksum,'zipVerified':True,'excluded':['node_modules','.git','.openai','source video frames/audio/work','temporary captures','private configuration'],'creator':CREDIT}
    if args.verify_http: report['httpVerification']=verify_http(output,archive_root)
    output.with_suffix('.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0


if __name__=='__main__':
    try: raise SystemExit(main())
    except Exception as error:
        print('ERROR: '+str(error),file=sys.stderr)
        raise SystemExit(1)
