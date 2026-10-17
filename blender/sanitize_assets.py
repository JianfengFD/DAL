#!/usr/bin/env python3
"""Remove local-home paths and PNG text metadata without changing scene geometry or pixels."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import struct

LOCAL_PATH = re.compile(rb'(?:/[Uu]sers/[^/\x00\r\n]+|/home/[^/\x00\r\n]+|[A-Za-z]:[\\/]Users[\\/][^\\/\x00\r\n]+)[^\x00\r\n]*')
PNG_TEXT = {b'tEXt', b'zTXt', b'iTXt'}


def clean_blend(path):
    path = Path(path); data = path.read_bytes()
    if not data.startswith(b'BLENDER'):
        raise ValueError(f'{path.name}: expected an uncompressed Blender file.')
    replacements = []
    def replace(match):
        original = match.group()
        normalized = original.decode('utf-8', errors='replace').replace('\\', '/')
        name = normalized.rsplit('/', 1)[-1]
        if name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            relative = ('//../public/assets/' + name).encode('utf-8')
        elif name.lower().endswith('.blend'):
            relative = ('//' + name).encode('utf-8')
        else:
            # The default saved file-browser directory is the host user's home.
            relative = b'//'
        if len(relative) > len(original):
            raise ValueError(f'{path.name}: relative replacement cannot fit the existing fixed-size path field.')
        replacements.append({'offset': match.start(), 'kind': 'render-path' if b'public/assets/' in relative else 'relative-directory'})
        return relative + b'\x00' * (len(original) - len(relative))
    cleaned = LOCAL_PATH.sub(replace, data)
    if len(cleaned) != len(data): raise AssertionError('Blender block offsets must remain unchanged.')
    if LOCAL_PATH.search(cleaned): raise AssertionError('A local home path remains.')
    if replacements: path.write_bytes(cleaned)
    return {'file': path.name, 'fieldsCleaned': len(replacements), 'geometryBytesPreserved': True, 'byteLengthUnchanged': True}


def png_chunks(data):
    if data[:8] != b'\x89PNG\r\n\x1a\n': raise ValueError('Not a PNG file.')
    offset = 8
    while offset < len(data):
        size = struct.unpack_from('>I', data, offset)[0]
        end = offset + 12 + size
        if end > len(data): raise ValueError('Truncated PNG chunk.')
        yield data[offset+4:offset+8], data[offset:end]
        offset = end
    if offset != len(data): raise ValueError('Invalid PNG chunk boundary.')


def strip_png_text(path):
    path = Path(path); before = path.read_bytes()
    chunks = list(png_chunks(before))
    before_pixels = hashlib.sha256(b''.join(blob for kind, blob in chunks if kind in {b'IHDR', b'PLTE', b'IDAT', b'tRNS'})).hexdigest()
    removed = sum(kind in PNG_TEXT for kind, _ in chunks)
    after = before[:8] + b''.join(blob for kind, blob in chunks if kind not in PNG_TEXT)
    after_chunks = list(png_chunks(after))
    after_pixels = hashlib.sha256(b''.join(blob for kind, blob in after_chunks if kind in {b'IHDR', b'PLTE', b'IDAT', b'tRNS'})).hexdigest()
    if before_pixels != after_pixels: raise AssertionError('PNG pixel or palette bytes changed.')
    if removed: path.write_bytes(after)
    return {'file': path.name, 'textChunksRemoved': removed, 'pixelPayloadSha256': after_pixels, 'pixelBytesUnchanged': True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--verify', action='store_true', help='Read-only verification; do not clean files.')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    reports = []
    for path in sorted((root/'blender').glob('daxia_*.blend')):
        if args.verify:
            assert not LOCAL_PATH.search(path.read_bytes()), path.name + ': local home path remains'
            reports.append({'file': path.name, 'privatePaths': 0})
        else: reports.append(clean_blend(path))
    for path in sorted((root/'public'/'assets').glob('*-preview.png')):
        if args.verify:
            assert not any(kind in PNG_TEXT for kind, _ in png_chunks(path.read_bytes())), path.name + ': text metadata remains'
            reports.append({'file': path.name, 'textMetadataChunks': 0})
        else: reports.append(strip_png_text(path))
    print(json.dumps({'passed': True, 'files': reports}, ensure_ascii=False, indent=2))


if __name__ == '__main__': main()
