#!/usr/bin/env python3
"""Validate the generated original Blender assets without Blender dependencies."""
import json
import math
import struct
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'public'/'assets'
CREDIT='by JF_Li@FD & Sol'
REQUIRED={'building_'+k for k in ('academy','lab','foundation','library','conference','dorm','cafe','admin')}

def inspect(name):
    p=ASSETS/(name+'.glb');data=p.read_bytes()
    magic,version,length=struct.unpack_from('<III',data)
    assert magic==0x46546C67 and version==2 and length==len(data),f'{name}: GLB header'
    chunks=[];offset=12
    while offset<len(data):
        n,kind=struct.unpack_from('<II',data,offset);offset+=8
        chunks.append((kind,data[offset:offset+n]));offset+=n
    assert offset==len(data)
    j=json.loads(next(b for kind,b in chunks if kind==0x4E4F534A))
    binary=next(b for kind,b in chunks if kind==0x004E4942)
    assert j['asset']['version']=='2.0'
    assert j['asset'].get('copyright')==CREDIT,f'{name}: author credit'
    assert j['scenes'][0]['extras']['creator']==CREDIT,f'{name}: scene creator'
    assert j['buffers'][0]['byteLength']<=len(binary)
    for view in j['bufferViews']:
        assert view.get('byteOffset',0)+view['byteLength']<=len(binary)
    triangles=0;vertices=0
    for mesh in j['meshes']:
        for prim in mesh['primitives']:
            a=j['accessors'][prim['attributes']['POSITION']]
            assert a['type']=='VEC3' and a['componentType']==5126
            view=j['bufferViews'][a['bufferView']]
            start=view.get('byteOffset',0)+a.get('byteOffset',0)
            step=view.get('byteStride',12)
            for i in range(a['count']):
                pos=struct.unpack_from('<fff',binary,start+i*step)
                assert all(math.isfinite(v) for v in pos),f'{name}: non-finite position'
            vertices+=a['count']
            assert 0<=prim['material']<len(j['materials'])
            idx=j['accessors'][prim['indices']]
            iv=j['bufferViews'][idx['bufferView']]
            fmt={5121:'B',5123:'H',5125:'I'}[idx['componentType']]
            width=struct.calcsize(fmt)
            begin=iv.get('byteOffset',0)+idx.get('byteOffset',0)
            values=struct.unpack_from('<'+fmt*idx['count'],binary,begin)
            assert max(values)<a['count'],f'{name}: index bounds'
            assert prim.get('mode',4)==4 and len(values)%3==0
            triangles+=len(values)//3
    nodes={n.get('name') for n in j['nodes']}
    if name=='campus':
        assert REQUIRED<=nodes,sorted(REQUIRED-nodes)
        assert len(data)<5*1024*1024
    assert any('credit' in str(n) for n in nodes)
    assert not j.get('images'),f'{name}: expected texture-free asset'
    result={'name':name,'bytes':len(data),'nodes':len(nodes),'meshes':len(j['meshes']),'materials':len(j['materials']),'vertices':vertices,'triangles':triangles,'credit':CREDIT}
    print(json.dumps(result,ensure_ascii=False))
    return result

if __name__=='__main__':
    results=[inspect(name) for name in ('campus','laboratory','conference','classroom')]
    meta=json.loads((ASSETS/'campus.json').read_text())
    assert meta['creator']==CREDIT
    assert {b['mesh'] for b in meta['buildings']}==REQUIRED
    assert all(len(b['center'])==len(b['labelAnchor'])==3 for b in meta['buildings'])
    print('PASS: 4 GLB assets, 8 clickable campus buildings, author credit, finite indexed geometry.')
