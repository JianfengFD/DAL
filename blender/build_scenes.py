#!/usr/bin/env python3
"""Build the original Daxia campus and three room dioramas with Blender.

Run: blender --background --python game/blender/build_scenes.py -- --scene all
All geometry is generated here. No external textures, fonts or assets required.
Export coordinates: Blender (x,y,z) -> glTF/Three (x,z,-y).
"""
import argparse
import json
import math
import os
import random
import runpy
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'assets'
SOURCE = ROOT / 'blender'
ASSETS.mkdir(parents=True, exist_ok=True)
random.seed(27)
M = {}
GROUPS = {}
ACTIVE = 'environment'
CREDIT = 'by JF_Li@FD & Sol'


def srgb(c):
    return c / 12.92 if c < .04045 else ((c + .055) / 1.055) ** 2.4


def material(name, hexcode, roughness=.72, metal=0, emission=0):
    h = hexcode.lstrip('#')
    rgb = [int(h[i:i+2], 16)/255 for i in (0,2,4)]
    rgba = (*[srgb(c) for c in rgb], 1)
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = rgba
    mat.use_nodes = True
    p = mat.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = rgba
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Metallic'].default_value = metal
    if emission:
        p.inputs['Emission Color'].default_value = rgba
        p.inputs['Emission Strength'].default_value = emission
    M[name] = mat
    return mat


def palette():
    material('ivory', 'E9DDC4')
    material('cream', 'F7EED7')
    material('stone', 'A8ADA5')
    material('paving', 'C3C5B2')
    material('pavinglight', 'DFD5BA')
    material('ink', '233D45')
    material('slate', '344E55')
    material('slatedark', '1E333C')
    material('glass', '365C66', .25, .25)
    material('teal', '2E857E', .4)
    material('water', '65ACAE', .18, .2)
    material('gold', 'EBA957', .45, .2)
    material('lit', 'FFCA7C', .35, 0, .35)
    material('coral', 'C7684E')
    material('brick', 'A64E41')
    material('blush', 'DE9273')
    material('grass', '5E7D6B')
    material('grasslight', '78917A')
    material('hedge', '365C50')
    material('leafgold', 'C79D4E')
    material('leafamber', 'DEAE5E')
    material('leafrust', 'AD6F46')
    material('leafgreen', '769370')
    material('bark', '665248')
    material('bench', 'AF8059')
    material('paper', 'E4E1D1')
    material('navy', '344B68')
    material('skin', 'E8AE84')
    material('pink', 'DA8081')
    material('purple', '8D7BAA')
    material('blue', '6C98B2')
    material('screen', '73D7CF', .2, 0, .3)


def register(obj, name, mat):
    obj.name = name
    if mat:
        obj.data.materials.append(M[mat] if isinstance(mat,str) else mat)
    GROUPS.setdefault(ACTIVE, []).append(obj)
    return obj


def cube(name, loc, scale, mat, bevel=.04, rotation=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.object
    ob.dimensions = scale
    ob.rotation_euler.z = rotation
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = ob.modifiers.new('Soft architectural edges','BEVEL')
        mod.width = bevel
        mod.segments = 1
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.modifier_apply(modifier=mod.name)
        mod = ob.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
        mod.keep_sharp = True
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return register(ob, name, mat)


def cylinder(name, loc, radius, depth, mat, vertices=16, rotation=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    ob = bpy.context.object
    if rotation:
        ob.rotation_euler = rotation
    return register(ob,name,mat)


def cone(name, loc, r1, r2, depth, mat, vertices=8):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=r1, radius2=r2, depth=depth, location=loc)
    return register(bpy.context.object,name,mat)


def ico(name, loc, radius, mat, scale=(1,1,1), subdivision=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivision, radius=radius, location=loc)
    ob = bpy.context.object
    ob.scale = scale
    return register(ob,name,mat)


def beam(name, a, b, radius, mat, vertices=8):
    a,b = Vector(a),Vector(b)
    ob=cylinder(name,(a+b)/2,radius,(b-a).length,mat,vertices)
    ob.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler()
    return ob


def torus(name, loc, major, minor, mat, rotation=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=24,minor_segments=6,location=loc)
    ob=bpy.context.object
    if rotation: ob.rotation_euler=rotation
    return register(ob,name,mat)


def roof(name, x,y,z,w,d,h,mat='slate'):
    # A crisp hipped roof with an overhanging eave.
    verts=[(x-w/2,y-d/2,z),(x+w/2,y-d/2,z),(x+w/2,y+d/2,z),(x-w/2,y+d/2,z),
           (x-w*.31,y,z+h),(x+w*.31,y,z+h)]
    faces=[(0,1,5,4),(1,2,5),(2,3,4,5),(3,0,4),(0,3,2,1)]
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(verts,[],faces)
    mesh.update()
    ob=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(ob)
    return register(ob,name,mat)


def windows(x,y,w,d,z,floors=2,cols=5,lit_probability=.25):
    for floor in range(floors):
        zz=z+floor*.91
        for i in range(cols):
            xx=x-w*.4+w*.8*i/max(cols-1,1)
            mm='lit' if random.random()<lit_probability else 'glass'
            cube('facade_window',(xx,y-d/2-.015,zz),(.45,.035,.57),mm,.015)
            cube('window_sill',(xx,y-d/2-.06,zz-.32),(.55,.13,.07),'cream',.01)
            cube('back_window',(xx,y+d/2+.015,zz),(.45,.035,.57),'glass',.01)
        for side in (-1,1):
            for j in range(2):
                cube('side_window',(x+side*(w/2+.015),y+d*(j-.5)*.5,zz),(.035,.52,.57),'glass',.01)


def entrance(x,y,z=0,w=1.35):
    cube('door_shadow',(x,y-.03,z+.65),(w,.05,1.3),'ink',.01)
    for side in (-1,1):
        cube('door_glass',(x+side*w*.23,y-.065,z+.62),(w*.4,.04,1.12),'glass',.01)
        cube('door_handle',(x+side*.08,y-.1,z+.63),(.025,.06,.18),'gold',.004)
    for i in range(3):
        cube('entrance_step',(x,y-.24-i*.16,z+.06-i*.06),(w+1.0+i*.2,.5,.12),'pavinglight',.025)


def plate(x,y,z,w=2.2,mat='teal'):
    cube('institution_nameplate',(x,y,z),(w,.09,.34),mat,.02)
    # Abstract polished brass markers stand in for an engraved institutional seal.
    for i in range(5):
        cube('brass_letter',(x+(i-2)*w*.13,y-.052,z),(.1,.02,.10),'gold',.005)


def academy(x,y):
    cube('academic_plinth',(x,y,.27),(7.2,3.9,.42),'stone')
    cube('academic_main',(x,y,2.05),(6.6,3.35,3.4),'ivory',.09)
    windows(x,y,6.6,3.35,1.25,3,7,.23)
    cube('academy_cornice',(x,y,3.82),(7.0,3.75,.27),'cream')
    roof('academy_roof',x,y,3.95,7.3,4.0,1.05)
    cube('portico_floor',(x,y-2.1,.38),(3.1,1.3,.23),'cream')
    for dx in (-1.1,-.38,.38,1.1):
        cylinder('portico_column',(x+dx,y-2.23,1.65),.115,2.45,'cream',12)
        cylinder('column_cap',(x+dx,y-2.23,2.9),.17,.12,'cream',12)
    cube('portico_lintel',(x,y-2.1,2.99),(3.1,1.35,.25),'cream')
    roof('portico_pediment',x,y-2.1,3.12,3.4,1.5,.58,'coral')
    entrance(x,y-1.7,.38)
    plate(x,y-2.81,3.01,1.9)
    cylinder('clock_face',(x,y-2.13,4.48),.31,.06,'cream',24,(math.pi/2,0,0))
    beam('clock_hand',(x,y-2.18,4.48),(x+.13,y-2.18,4.6),.02,'ink')
    beam('clock_hand',(x,y-2.18,4.48),(x,y-2.18,4.69),.02,'ink')
    # Two corner chimneys.
    for dx in (-2.4,2.4): cube('roof_chimney',(x+dx,y+.4,4.61),(.5,.5,.7),'brick')


def lab(x,y):
    cube('lab_base',(x,y,.2),(5.7,4.4,.3),'stone')
    cube('lab_main',(x,y,2.1),(5.3,4.0,3.8),'coral',.08)
    cube('lab_upper',(x+.6,y,4.04),(4.1,3.6,.55),'ivory')
    for floor in range(3):
        zz=.98+floor*1.03
        for j in range(5):
            xx=x-2.05+j*1.02
            cube('lab_window_band',(xx,y-2.025,zz),(.77,.055,.66),'glass',.01)
            cube('lab_window_mullion',(xx,y-2.06,zz),(.045,.045,.67),'cream',.005)
        cube('lab_band',(x,y-2.08,zz-.42),(5.4,.13,.15),'ivory')
    windows(x,y,5.3,4.0,1.0,3,4,.2)
    cube('lab_roof',(x,y,4.44),(5.7,4.35,.22),'slatedark')
    cube('lab_stairwell',(x-1.85,y+.55,4.85),(1.25,1.6,.85),'ivory')
    for dx in (.0,.8,1.6):
        cylinder('extraction_stack',(x+dx,y+.6,4.98),.19,1.15,'slate',12)
        cone('stack_cap',(x+dx,y+.6,5.58),.27,.2,.12,'ink',12)
    for dx in (-.5,.5,1.5):
        ob=cube('solar_panel',(x+dx,y-.65,4.72),(.8,1.15,.06),'navy',.01)
        ob.rotation_euler.x=.22
        for dy in (-.27,.0,.27): cube('solar_grid',(x+dx,y-.65+dy,4.78),(.79,.016,.018),'blue',0)
    cube('lab_entry_canopy',(x,y-2.55,1.9),(2.1,1.15,.18),'cream')
    entrance(x,y-2.05,.33)
    plate(x,y-2.16,3.95,2.5)
    # Stylised molecule above the entry.
    for dx,dz in [(-.3,2.6),(.2,2.9),(.48,2.5)]: ico('molecule_atom',(x+dx,y-2.12,dz),.1,'gold')
    beam('molecule_bond',(x-.3,y-2.12,2.6),(x+.2,y-2.12,2.9),.025,'gold')
    beam('molecule_bond',(x+.2,y-2.12,2.9),(x+.48,y-2.12,2.5),.025,'gold')


def foundation(x,y):
    cube('foundation_plinth',(x,y,.25),(5.9,4.7,.38),'stone')
    cube('foundation_building',(x,y,2.18),(5.2,4.0,3.8),'ivory',.08)
    cube('foundation_glass',(x,y-2.02,2.42),(4.65,.08,2.85),'glass',.02)
    for dx in (-2,-1,0,1,2):
        cube('foundation_fins',(x+dx,y-2.13,2.42),(.12,.35,3.2),'cream',.025)
    for zz in (1.5,2.5,3.5): cube('foundation_horizontal',(x,y-2.15,zz),(4.9,.15,.08),'gold',.01)
    cube('foundation_roof',(x,y,4.19),(5.8,4.65,.3),'slate')
    cube('foundation_entry',(x,y-2.6,1.95),(2.5,1.1,.25),'slate')
    entrance(x,y-2.04,.35)
    plate(x,y-2.3,4.0,3.1)
    # A floating gold diamond is the Foundation's fictional identity.
    ob=cube('foundation_diamond',(x,y,4.92),(.65,.65,.65),'gold',.05)
    ob.rotation_euler=(.68,.45,.75)
    cylinder('diamond_pedestal',(x,y,4.51),.13,.4,'cream',8)
    windows(x,y,5.2,4,1.25,3,5,.15)


def library(x,y):
    cube('library_base',(x,y,.22),(5.7,4.0,.3),'stone')
    cube('library_body',(x,y,1.7),(5.2,3.55,2.9),'ivory',.08)
    cube('library_tower',(x-1.9,y+.35,2.6),(1.35,2.2,4.7),'coral')
    roof('library_main_roof',x+.4,y,3.22,5.0,4.0,.7,'slate')
    roof('library_tower_roof',x-1.9,y+.35,4.95,1.75,2.6,.5,'slatedark')
    for j in range(5):
        xx=x-.8+j*.75
        cube('tall_library_window',(xx,y-1.805,1.88),(.46,.055,1.45),'glass',.04)
        cube('tall_window_cross',(xx,y-1.85,1.94),(.47,.055,.07),'cream',.008)
    entrance(x+.55,y-1.8,.35)
    plate(x+.55,y-2.1,2.88,2.3)
    for z in (1.5,2.5,3.5,4.4): cube('tower_window',(x-1.9,y-.78,z),(.6,.05,.43),'lit' if z==3.5 else 'glass',.01)
    # Oversized book-shaped sculpture.
    for dx,ang in [(-.25,.18),(.25,-.18)]:
        ob=cube('book_sculpture',(x+dx+.6,y-2.85,.87),(.58,.18,.75),'gold',.015)
        ob.rotation_euler.y=ang
    cube('book_sculpture_base',(x+.6,y-2.85,.45),(1.25,.65,.16),'stone')


def conference(x,y):
    cube('conference_base',(x,y,.22),(6.7,4.8,.33),'stone')
    cube('conference_foyer',(x,y-1.0,1.2),(6.0,2.3,1.9),'ivory')
    cube('conference_glazing',(x,y-2.17,1.4),(5.6,.06,1.45),'glass')
    for dx in (-2.5,-1.5,-.5,.5,1.5,2.5): cube('foyer_pillars',(x+dx,y-2.25,1.42),(.1,.25,1.7),'cream',.01)
    cylinder('auditorium_drum',(x,y+.35,1.9),2.45,3.2,'coral',32)
    cylinder('auditorium_cornice',(x,y+.35,3.55),2.65,.22,'cream',32)
    cone('auditorium_roof',(x,y+.35,3.9),2.8,1.2,.6,'slate',32)
    cylinder('auditorium_roof_disc',(x,y+.35,4.25),1.23,.12,'slatedark',32)
    for angle in range(0,360,30):
        a=math.radians(angle)
        dx,dy=math.cos(a)*2.47,math.sin(a)*2.47
        ob=cube('auditorium_rib',(x+dx,y+.35+dy,2.15),(.12,.12,2.6),'cream',.015)
    cube('conference_canopy',(x,y-2.5,2.43),(6.6,1.35,.2),'slatedark')
    entrance(x,y-2.21,.35)
    plate(x,y-3.2,2.43,2.7)
    # Conference banners.
    for dx in (-2.4,2.4):
        cylinder('banner_pole',(x+dx,y-2.9,1.4),.035,2.8,'gold',8)
        cube('conference_banner',(x+dx+.23,y-2.9,2.1),(.5,.055,.92),'teal',.01)
        cube('banner_emblem',(x+dx+.23,y-2.94,2.18),(.2,.02,.2),'gold',.01)


def dorm(x,y):
    cube('dorm_base',(x,y,.2),(6.2,3.6,.25),'stone')
    cube('dorm_body',(x,y,2.15),(5.8,3.15,3.9),'ivory')
    for j in range(6):
        xx=x-2.3+j*.92
        for floor in range(4):
            zz=.75+floor*.9
            cube('dorm_window',(xx,y-1.61,zz),(.51,.04,.54),'lit' if random.random()<.45 else 'glass',.01)
        cube('dorm_vertical_brick',(xx+.41,y-1.65,2.12),(.1,.1,3.72),'coral',.01)
    cube('dorm_roof',(x,y,4.17),(6.2,3.5,.2),'slate')
    cube('dorm_canopy',(x,y-1.95,1.8),(1.9,1.05,.16),'teal')
    entrance(x,y-1.6,.3)
    plate(x,y-1.78,3.82,2.2)
    cube('water_tank_support',(x+1.9,y+.2,4.6),(.8,.8,.7),'slate')
    cylinder('water_tank',(x+1.9,y+.2,5.05),.55,.75,'stone',16)
    # Bicycle rack and bicycles.
    for dx in (-2.3,-1.65,-1.): bicycle(x+dx,y-2.5,.0)


def cafe(x,y):
    cube('cafe_base',(x,y,.22),(4.8,3.7,.3),'stone')
    cube('cafe_body',(x,y,1.15),(4.3,3.1,1.9),'coral')
    roof('cafe_roof',x,y,2.15,4.9,3.7,.8,'slate')
    for dx in (-1.2,1.2):
        cube('cafe_window',(x+dx,y-1.58,1.25),(.92,.045,1.0),'lit',.02)
        cube('window_mullion',(x+dx,y-1.62,1.25),(.06,.05,1.0),'ivory',.01)
    entrance(x,y-1.57,.3,.95)
    for i in range(10):
        ob=cube('striped_awning',(x-2.025+i*.45,y-1.94,1.99),(.45,1.0,.08),'cream' if i%2 else 'teal',.01)
        ob.rotation_euler.x=.16
    plate(x,y-2.45,2.08,2.2,'teal')
    for dx in (-1.6,1.4):
        table(x+dx,y-2.9)
    cylinder('cafe_chimney',(x-1.3,y+.3,2.91),.17,1.2,'brick',8)
    cube('cafe_chimney_cap',(x-1.3,y+.3,3.54),(.55,.55,.15),'slatedark')


def admin(x,y):
    cube('admin_base',(x,y,.22),(5.0,3.8,.3),'stone')
    cube('admin_body',(x,y,1.6),(4.6,3.25,2.8),'ivory')
    windows(x,y,4.6,3.25,1.0,3,5,.3)
    cube('admin_cornice',(x,y,3.13),(5.0,3.6,.23),'cream')
    roof('admin_roof',x,y,3.26,5.2,3.9,.7,'slate')
    cube('admin_entry',(x,y-1.95,1.92),(2.15,1.1,.2),'teal')
    entrance(x,y-1.66,.3)
    plate(x,y-1.83,2.82,2.2)
    # A small administrative annex.
    cube('admin_annex',(x+2.6,y+.35,1.0),(1.2,2.0,1.55),'coral')
    cube('admin_annex_roof',(x+2.6,y+.35,1.83),(1.5,2.3,.15),'slatedark')


def tree(x,y,size=1,color=None):
    color=color or random.choice(['leafgold','leafamber','leafrust','leafgreen'])
    cylinder('tree_trunk',(x,y,.65*size),.09*size,1.3*size,'bark',7)
    for dx,dy,dz,r in [(-.35,.0,1.55,.65),(.35,.05,1.8,.7),(0,-.25,2.05,.75),(0,.3,2.15,.6)]:
        ico('autumn_crown',(x+dx*size,y+dy*size,dz*size),r*size,color,(1,.9,1.2),1)
    cylinder('tree_guard',(x,y,.12),.45*size,.15,'pavinglight',12)


def pine(x,y,size=1):
    cylinder('pine_trunk',(x,y,.65*size),.09*size,1.3*size,'bark',6)
    for z,r in [(1.0,.75),(1.65,.61),(2.2,.43)]: cone('pine_crown',(x,y,z*size),r*size,0,1.3*size,'hedge',7)


def bench(x,y,angle=0):
    parts=[]
    for i in (-.15,.0,.15): parts.append(cube('bench_slats',(x,y+i,.48),(1.1,.11,.09),'bench',.015))
    for dx in (-.4,.4):
        parts.append(cube('bench_legs',(x+dx,y,.25),(.08,.37,.48),'ink',.015))
        parts.append(cube('bench_back_leg',(x+dx,y+.22,.65),(.07,.06,.68),'ink',.01))
    for z in (.68,.84): parts.append(cube('bench_back',(x,y+.22,z),(1.12,.07,.11),'bench',.015))
    if angle:
        for ob in parts:
            dx,dy=ob.location.x-x,ob.location.y-y
            ob.location.x=x+dx*math.cos(angle)-dy*math.sin(angle)
            ob.location.y=y+dx*math.sin(angle)+dy*math.cos(angle)
            ob.rotation_euler.z+=angle


def table(x,y):
    cylinder('cafe_table',(x,y,.72),.43,.08,'ivory',16)
    cylinder('cafe_table_leg',(x,y,.38),.06,.68,'ink',8)
    for dx in (-.64,.64):
        cube('cafe_stool',(x+dx,y,.46),(.34,.34,.1),'teal',.025)
        for ox in (-.1,.1): cube('stool_leg',(x+dx+ox,y,.24),(.04,.2,.4),'ink',.005)
    cylinder('cafe_cup',(x+.12,y,.83),.055,.13,'cream',8)


def lamp(x,y):
    cylinder('lamp_base',(x,y,.1),.16,.2,'ink',10)
    cylinder('lamp_post',(x,y,1.15),.045,2.2,'slate',8)
    cube('lamp_bracket',(x,y,2.28),(.42,.08,.09),'ink',.015)
    for dx in (-.17,.17):
        cube('lamp_glow',(x+dx,y,2.15),(.13,.13,.25),'lit',.01)
        cube('lamp_cap',(x+dx,y,2.3),(.2,.2,.06),'ink',.01)


def scientist(x,y,coat='cream',angle=0,book=False,size=1,z=0):
    first=len(GROUPS.get(ACTIVE,[]))
    # Friendly toy-scale researchers; the group is intentionally part of campus life.
    cylinder('scholar_head',(x,y,.96),.105,.22,'skin',8)
    ico('scholar_hair',(x,y,1.07),.12,'ink',(1,1,.6),1)
    cone('scholar_coat',(x,y,.64),.145,.12,.46,coat,8)
    for dx in (-.07,.07):
        cube('scholar_leg',(x+dx,y,.27),(.07,.09,.32),'navy',.012)
        cube('scholar_shoe',(x+dx,y-.03,.09),(.09,.15,.08),'ink',.01)
    for dx in (-.19,.19):
        beam('scholar_arm',(x+dx*.7,y,.79),(x+dx,y-.03,.48),.045,coat)
        ico('scholar_hand',(x+dx,y-.03,.47),.047,'skin')
    if book: cube('scholar_notebook',(x+.19,y-.04,.59),(.14,.08,.21),'coral',.01)
    else: cube('scholar_backpack',(x,y+.14,.7),(.18,.1,.24),'gold',.02)
    for ob in GROUPS[ACTIVE][first:]:
        ob.location=Vector((x,y,z))+(ob.location-Vector((x,y,0)))*size
        ob.scale*=size


def bicycle(x,y,z):
    for xx in (-.3,.3): torus('bicycle_tire',(x+xx,y,z+.3),.23,.025,'ink',(math.pi/2,0,0))
    for a,b in [((-.3,0,.3),(0,0,.6)),((0,0,.6),(.3,0,.3)),((.3,0,.3),(0,0,.3)),((0,0,.3),(-.3,0,.3)),((0,0,.3),(0,0,.6))]:
        beam('bicycle_frame',(x+a[0],y+a[1],z+a[2]),(x+b[0],y+b[1],z+b[2]),.018,'teal',6)
    beam('bicycle_handle',(x+.3,y,z+.3),(x+.2,y,z+.75),.02,'ink',6)
    cube('bicycle_saddle',(x-.05,y,z+.65),(.17,.12,.04),'ink',.005)


def group_join():
    for name,obs in GROUPS.items():
        obs=[o for o in obs if o.name in bpy.data.objects and o.type=='MESH']
        if not obs: continue
        bpy.ops.object.select_all(action='DESELECT')
        for ob in obs: ob.select_set(True)
        bpy.context.view_layer.objects.active=obs[0]
        if len(obs)>1: bpy.ops.object.join()
        ob=bpy.context.object
        ob.name=name
        ob.data.name=name+'_mesh'
        # All exported meshes have an easy-to-understand world-space root.
        bpy.context.scene.cursor.location=(0,0,0)
        bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        ob['asset_author']='Original procedural geometry for Daxia Academic Odyssey'
        if name.startswith('building_'): ob['interaction_id']=name.replace('building_','')


def setup_scene(name):
    global GROUPS,ACTIVE
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for data in list(bpy.data.materials): bpy.data.materials.remove(data)
    GROUPS={}; M.clear(); ACTIVE='environment'; palette()
    scene=bpy.context.scene
    scene.name=name
    scene['creator']=CREDIT
    scene['project']='大夏 · 学术浮生'
    scene.render.engine='CYCLES'
    scene.cycles.samples=48
    scene.cycles.use_denoising=True
    scene.render.resolution_x=1400
    scene.render.resolution_y=1050
    scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG'
    scene.render.film_transparent=False
    scene.world.color=(.15,.19,.2)
    scene.world.use_nodes=True
    world=scene.world.node_tree.nodes.get('Background')
    world.inputs['Color'].default_value=(.19,.29,.32,1)
    world.inputs['Strength'].default_value=.65
    scene.view_settings.view_transform='AgX'
    scene.view_settings.look='AgX - Medium High Contrast'
    scene.render.image_settings.color_mode='RGBA'
    return scene


def lighting(camera=(33,-39,32),target=(0,0,0),ortho=40):
    bpy.ops.object.camera_add(location=camera)
    cam=bpy.context.object; cam.name='Presentation_Camera'
    cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
    cam.data.type='ORTHO';cam.data.ortho_scale=ortho;cam.data.lens=50
    bpy.context.scene.camera=cam
    bpy.ops.object.light_add(type='AREA',location=(-9,-10,18))
    light=bpy.context.object; light.name='Warm_Key';light.data.energy=2500;light.data.shape='DISK';light.data.size=9
    light.data.color=(1,.84,.65)
    light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.light_add(type='AREA',location=(9,9,12))
    light=bpy.context.object;light.name='Cool_Rim';light.data.energy=1800;light.data.size=12;light.data.color=(.56,.78,1)
    light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.light_add(type='SUN',location=(-6,-10,16))
    light=bpy.context.object;light.name='Evening_Sun';light.data.energy=2.0;light.data.angle=.12;light.data.color=(1,.85,.68)
    light.rotation_euler=(math.radians(25),math.radians(-20),math.radians(-25))


def export(name,render=True):
    global ACTIVE
    ACTIVE=name+'_credit'
    plaque_y={'campus':-14.29,'laboratory':-5.22,'conference':-6.69,'classroom':-5.74}[name]
    bpy.ops.object.text_add(location=(0,plaque_y,-.39 if name=='campus' else -.25),rotation=(math.pi/2,0,0))
    text=bpy.context.object
    text.data.body=CREDIT
    text.data.align_x='CENTER';text.data.align_y='CENTER'
    text.data.size=.20 if name=='campus' else .15
    text.data.extrude=.002
    bpy.ops.object.convert(target='MESH')
    register(bpy.context.object,'creator_credit','gold')
    group_join()
    blend=SOURCE/f'daxia_{name}.blend'
    glb=ASSETS/f'{name}.glb'
    bpy.context.scene.render.filepath='//../public/assets/'+name+'-preview.png'
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=False,export_cameras=False,export_lights=False,export_apply=True,export_yup=True,export_extras=True,export_materials='EXPORT',export_normals=True,export_texcoords=False,export_animations=False,export_copyright=CREDIT)
    if render:
        bpy.context.scene.render.filepath=str(ASSETS/f'{name}-preview.png')
        bpy.ops.render.render(write_still=True)
    sanitizer=runpy.run_path(str(SOURCE/'sanitize_assets.py'),run_name='daxia_asset_sanitizer')
    sanitizer['clean_blend'](blend)
    preview=ASSETS/f'{name}-preview.png'
    if preview.exists(): sanitizer['strip_png_text'](preview)
    print(f'ASSET_COMPLETE {name} bytes={glb.stat().st_size} blend={blend}')


def campus(render=True):
    global ACTIVE
    setup_scene('Daxia · Autumn Campus')
    ACTIVE='campus_ground'
    cube('floating_island_base',(0,0,-.56),(35.4,28.5,1.1),'slatedark',.48)
    cube('island_trim',(0,0,-.07),(35.0,28.15,.18),'stone',.15)
    cube('lawn_surface',(0,0,.05),(34.6,27.8,.18),'grass',.15)
    # Broad promenades with brass-coloured center stripes and pedestrian pavers.
    cube('central_north_south_walk',(0,-.2,.16),(5.1,24.8,.1),'paving',.04)
    cube('cross_campus_walk',(0,-.45,.17),(31.9,3.1,.12),'paving',.04)
    cube('south_campus_walk',(0,-6.0,.17),(31.9,1.75,.12),'paving',.04)
    for xx in (-3.9,3.9): cube('courtyard_edge',(xx,.65,.19),(.13,10.7,.11),'pavinglight',.01)
    for xx in (-2.3,2.3): cube('promenade_stripe',(xx,-.2,.22),(.06,24.0,.02),'pavinglight',0)
    for yy in (-4.0,3.5): cube('plaza_border',(0,yy,.2),(8,.13,.1),'pavinglight',0)
    cube('central_plaza',(0,-.2,.20),(7.6,7.2,.14),'pavinglight',.06)
    for i in range(-4,5):
        cube('plaza_paver_line',(i*.82,-.2,.278),(.014,7.0,.005),'stone',0)
        cube('plaza_paver_line',(0,-.2+i*.78,.28),(7.4,.014,.005),'stone',0)
    # Borders and modest planting beds.
    for xx in (-16.6,16.6):
        cube('perimeter_kerb',(xx,0,.22),(.22,26.5,.28),'pavinglight',.025)
    for yy in (-13.3,13.3): cube('perimeter_kerb',(0,yy,.22),(33.4,.22,.28),'pavinglight',.025)
    for xx,yy,w,d in [(-6,1.4,1.5,5.7),(5.6,1.4,1.5,5.7),(-6,-9.0,1.2,4.7),(4,-9.3,1.2,4.4),(-14.9,4.2,1.15,7.8),(14.8,4.4,1.15,8.2)]:
        cube('raised_garden_edge',(xx,yy,.25),(w,d,.3),'pavinglight',.05)
        cube('raised_garden_soil',(xx,yy,.41),(w-.14,d-.14,.05),'hedge',.03)
    # Fountain with orbit sculpture, a visual anchor for the entire university.
    ACTIVE='campus_sculpture'
    cylinder('fountain_outer',(0,-.15,.42),1.52,.32,'stone',48)
    cylinder('fountain_rim',(0,-.15,.59),1.56,.13,'cream',48)
    cylinder('fountain_water',(0,-.15,.67),1.38,.045,'water',48)
    cylinder('sculpture_plinth',(0,-.15,.91),.38,.5,'slate',12)
    beam('orbit_core',(0,-.15,1.1),(0,-.15,3.05),.09,'gold',12)
    torus('orbit_ring',(0,-.15,2.15),.91,.065,'gold',(1.06,.16,.48))
    torus('orbit_ring',(0,-.15,2.15),.91,.05,'cream',(.35,1.16,-.35))
    ico('orbit_nucleus',(0,-.15,2.15),.24,'coral',subdivision=2)
    for a in (.4,2.6,4.6):
        ico('orbit_electron',(.88*math.cos(a),-.15+.38*math.sin(a),2.15+.75*math.sin(a)),.13,'gold',subdivision=1)
    # The eight institutions are a deliberate interaction contract with the game.
    buildings=[
        ('academy','教学楼 · 院系',academy,(0,8.6),[0,5.3,-8.6]),
        ('lab','格物实验楼',lab,(-9.8,7.0),[-9.8,5.6,-7.0]),
        ('foundation','大夏自然基金委',foundation,(9.6,7.4),[9.6,5.8,-7.4]),
        ('library','知微图书馆',library,(-10.8,-.5),[-10.8,5.9,.5]),
        ('conference','群贤会议中心',conference,(10.2,-.7),[10.2,5.0,.7]),
        ('dorm','青年学者公寓',dorm,(-10.2,-8.8),[-10.2,5.8,8.8]),
        ('cafe','未名咖啡',cafe,(-1.5,-9.0),[-1.5,4.2,9.0]),
        ('admin','校务行政楼',admin,(8.5,-9.2),[8.5,4.8,9.2]),
    ]
    metadata={'title':'大夏 · 学术浮生','creator':CREDIT,'generator':'Blender 4.5 procedural scene','coordinateSystem':'glTF Y-up, Blender (x,y,z) becomes (x,z,-y)','bounds':{'width':35.4,'depth':28.5,'height':6.0},'recommendedCamera':{'position':[32,33,39],'target':[0,0,0],'orthographicSize':40},'buildings':[]}
    for ident,label,fun,(x,y),anchor in buildings:
        ACTIVE='building_'+ident
        fun(x,y)
        metadata['buildings'].append({'id':ident,'name':label,'mesh':'building_'+ident,'center':[x,0,-y],'labelAnchor':anchor})
    ACTIVE='campus_trees'
    positions=[(-15.2,-11.6,.9),(-14.8,-7.9,.85),(-15.1,-4.3,1),(-15.2,1.5,.95),(-15.3,5,1.05),(-14.9,9.0,1.1),(-12.8,12,1.05),(-9.5,12.2,.9),(-5.5,11.8,1),(-4.9,7.2,.85),(4.7,7.8,1),(6.3,12.2,.9),(10.2,12.0,1),(14.7,11.4,.9),(15.2,8.0,1),(15.1,4.4,1.1),(15.3,.4,.9),(15.1,-4.6,1.05),(15.2,-8.2,.95),(13.8,-11.8,.8),(-5.2,-11.7,.85),(3.1,-12,.85),(-5.9,1.8,.75),(-5.9,-1.7,.85),(5.6,1.9,.85),(5.6,-2.0,.75)]
    for x,y,s in positions: tree(x,y,s)
    for x,y in [(-5.3,-6.8),(4.0,-7.5),(-3.3,11.5),(3.4,11.5)]: pine(x,y,.75)
    ACTIVE='campus_props'
    for x,y,a in [(-3.2,2.1,math.pi/2),(3.3,2.1,-math.pi/2),(-3.2,-2.5,math.pi/2),(3.3,-2.5,-math.pi/2),(-5,-5.0,0),(5.2,-5.0,0),(-6.2,4.1,0)]: bench(x,y,a)
    for x,y in [(-2.4,4.2),(2.4,4.2),(-2.5,-4.7),(2.5,-4.7),(-6.5,-3),(6.8,-3),(-6.6,10.3),(6.6,10.3),(-13.8,-5.9),(13.7,-5.9)]: lamp(x,y)
    # University gate: warm brass posts and a understated freestanding sign.
    for x in (-3.1,3.1):
        cube('campus_gate_pillar',(x,-12.3,1.0),(.55,.6,1.8),'cream')
        cube('campus_gate_cap',(x,-12.3,1.95),(.7,.74,.15),'slate')
        ico('gate_finial',(x,-12.3,2.15),.13,'gold')
    cube('campus_identity_sign',(-5.0,-12.4,.85),(2.3,.35,1.25),'slate')
    for i in range(5): cube('gate_brass_letters',(-5.8+i*.4,-12.59,.95),(.19,.035,.22),'gold',.015)
    # Bikes, bins and modern campus noticeboard.
    for x,y in [(-3.4,5.0),(3.3,5.0),(-6.2,-5.4),(6.4,-5.4)]:
        cube('campus_recycling_bin',(x,y,.42),(.35,.35,.65),'teal',.04)
        cube('bin_lid',(x,y,.76),(.39,.39,.08),'slate',.02)
    for x,y in [(-6.1,-1.7),(6.2,3.8)]:
        for dx in (-.55,.55): cylinder('noticeboard_post',(x+dx,y,.85),.04,1.7,'slate',8)
        cube('noticeboard',(x,y,1.37),(1.35,.1,.9),'slate')
        for dx,col in [(-.39,'paper'),(0,'gold'),(.39,'paper')]: cube('campus_poster',(x+dx,y-.06,1.38),(.3,.015,.58),col,.01)
    for x in (-.8,0,.8): cube('crosswalk_paver',(x,-11.8,.24),(.38,1.1,.02),'cream',0)
    ACTIVE='campus_people'
    for x,y,col,b in [(-1.2,4.2,'cream',True),(1.1,3.6,'cream',False),(-3,-3.7,'blue',True),(4.5,-5.5,'coral',False),(-5.3,3.0,'cream',True),(7.5,-4.6,'navy',True),(-1.4,-6.0,'gold',False),(1.2,-7.2,'teal',True),(6.7,4.9,'cream',False),(-7,-4.8,'purple',True),(-12.6,-4.6,'cream',False),(13,-4.8,'teal',True)]: scientist(x,y,col,book=b)
    # A little fall foliage at paving edges adds scale without textures.
    ACTIVE='campus_foliage'
    for _ in range(130):
        x=random.uniform(-15.8,15.8);y=random.uniform(-12.5,12.5)
        if abs(x)<3.8 and -4<y<4: continue
        ico('fallen_leaf',(x,y,.24),random.uniform(.035,.08),random.choice(['leafgold','leafrust','leafamber']),(1.4,.65,.13),1)
    lighting(camera=(34,-41,35),target=(0,0,1),ortho=42.5)
    export('campus',render)
    (ASSETS/'campus.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')


def lab_interior(render=True):
    global ACTIVE
    setup_scene('Daxia · Laboratory')
    ACTIVE='lab_room'
    cube('room_base',(0,0,-.25),(13.4,10.4,.6),'slatedark',.18)
    cube('room_floor',(0,0,.09),(13,10,.15),'paving',.04)
    cube('back_wall',(0,4.85,1.9),(13,.2,3.7),'ivory')
    cube('left_wall',(-6.4,0,1.9),(.2,10,3.7),'ivory')
    for x in range(-6,7): cube('floor_grid',(x,0,.17),(.012,9.8,.008),'stone',0)
    for y in range(-4,5): cube('floor_grid',(0,y,.17),(12.8,.012,.008),'stone',0)
    for y in (-2,1,3):
        cube('lab_window',(-6.26,y,2.25),(.03,1.55,1.45),'glass',.01)
        cube('window_mullion',(-6.21,y,2.25),(.08,.06,1.45),'cream',.01)
        cube('window_mullion',(-6.21,y,2.25),(.08,1.55,.06),'cream',.01)
    ACTIVE='lab_benches'
    for x in (-2.8,2.4):
        for y in (-1.6,1.8):
            cube('island_cabinet',(x,y,.68),(3.5,1.5,1.0),'teal')
            cube('island_countertop',(x,y,1.24),(3.7,1.7,.16),'ivory',.05)
            for dx in (-1.1,0,1.1):
                cube('cabinet_door',(x+dx,y-.77,.69),(.98,.06,.87),'glass',.02)
                cube('cabinet_handle',(x+dx+.33,y-.82,.8),(.03,.04,.23),'gold',.005)
            cube('lab_power_rail',(x,y+.4,1.53),(3.4,.15,.18),'slate')
            # Microscope: base, angled arm, objective and stage.
            mx,my=x-.8,y-.1
            cube('microscope_base',(mx,my,1.38),(.45,.44,.12),'slate')
            beam('microscope_arm',(mx+.1,my,1.43),(mx+.18,my,1.98),.07,'ivory')
            beam('microscope_head',(mx+.18,my,1.98),(mx-.08,my,2.12),.08,'ivory')
            cylinder('microscope_eyepiece',(mx-.11,my,2.16),.05,.15,'ink',8)
            cube('microscope_stage',(mx,my,1.69),(.42,.35,.06),'ink',.015)
            cylinder('microscope_objective',(mx-.04,my,1.85),.05,.2,'gold',8)
            cube('lab_notebook',(x+.8,y-.35,1.36),(.5,.37,.05),'coral',.02)
            for dx in (.45,.7,.95):
                cylinder('flask_base',(x+dx,y+.3,1.45),.09,.22,'glass',12)
                cylinder('flask_neck',(x+dx,y+.3,1.61),.04,.18,'screen',8)
            cylinder('petri_dish',(x+1.3,y-.35,1.36),.13,.04,'water',16)
    ACTIVE='lab_equipment'
    cube('instrument_console',(4.8,3.8,1.03),(2.0,1.45,1.7),'cream')
    cube('instrument_glass',(4.8,3.05,1.38),(1.5,.05,.83),'glass')
    cube('instrument_screen',(4.8,3.0,1.44),(.95,.03,.46),'screen')
    for dx in (-.45,0,.45): cylinder('instrument_buttons',(4.8+dx,2.99,.93),.06,.035,'gold',8,(math.pi/2,0,0))
    cube('cryogenic_fridge',(-4.7,3.86,1.5),(1.7,1.45,2.65),'cream')
    cube('fridge_door',(-4.7,3.1,1.5),(1.46,.07,2.3),'ivory')
    cube('fridge_handle',(-4.15,3.01,1.45),(.07,.08,.65),'slate')
    cylinder('nitrogen_dewar',(-4.6,1.65,.9),.47,1.45,'stone',20)
    cylinder('dewar_top',(-4.6,1.65,1.67),.25,.13,'slate',16)
    cube('lab_whiteboard',(-.4,4.7,2.4),(5.3,.1,1.8),'cream')
    # A diagram of molecules and a promising trace, drawn as real geometry.
    for dx,dz,r in [(-1.6,2.4,.22),(-.9,2.8,.18),(-.8,2.0,.15)]:
        cylinder('whiteboard_atom',(dx,4.63,dz),r,.035,'teal',16,(math.pi/2,0,0))
    beam('whiteboard_bond',(-1.6,4.6,2.4),(-.9,4.6,2.8),.025,'teal')
    beam('whiteboard_bond',(-1.6,4.6,2.4),(-.8,4.6,2.0),.025,'teal')
    points=[(.05,1.95),(.4,2.02),(.7,2.13),(1.0,2.6),(1.35,2.75),(1.7,2.8)]
    for a,b in zip(points[:-1],points[1:]): beam('result_graph',(a[0],4.6,a[1]),(b[0],4.6,b[1]),.023,'coral')
    beam('plot_axis',(0,4.6,1.9),(1.85,4.6,1.9),.015,'ink')
    beam('plot_axis',(0,4.6,1.9),(0,4.6,2.95),.015,'ink')
    for x,y in [(-4.1,-3.2),(.1,-3.1),(3.9,.05)]:
        cylinder('lab_stool',(x,y,.67),.28,.12,'slate',12)
        cylinder('stool_leg',(x,y,.36),.06,.55,'ink',8)
        for a in (0,2.1,4.2): beam('stool_feet',(x,y,.17),(x+.33*math.cos(a),y+.33*math.sin(a),.12),.03,'ink')
    ACTIVE='lab_people'
    for x,y in [(-.3,-1.3),(3.6,-3),(-3.8,.1)]:
        scientist(x,y,'cream',book=True,size=1.5,z=.17)
    ACTIVE='lab_details'
    cube('safety_shower',(-5.5,-3.8,1.3),(.12,.12,2.5),'gold')
    beam('shower_pipe',(-5.5,-3.8,2.5),(-5.0,-3.8,2.5),.05,'gold')
    cone('shower_head',(-5,-3.8,2.47),.2,.08,.12,'gold',12)
    cube('lab_bin',(5.3,-3.8,.48),(.5,.5,.75),'teal')
    cube('lab_safety_label',(-6.25,-4.1,2.2),(.04,.6,.6),'gold')
    lighting(camera=(15,-18,15),target=(0,.5,1),ortho=18.8)
    export('laboratory',render)


def conference_interior(render=True):
    global ACTIVE
    setup_scene('Daxia · Conference Hall')
    ACTIVE='hall_room'
    cube('hall_base',(0,0,-.3),(15.3,13.3,.65),'slatedark',.2)
    cube('hall_floor',(0,0,.08),(15,13,.15),'bench',.03)
    cube('hall_back_wall',(0,6.3,2.5),(15,.22,5),'ivory')
    cube('hall_left_wall',(-7.4,0,2.5),(.2,13,5),'ivory')
    for x in (-6,-3,0,3,6): cube('wall_acoustic_rib',(x,6.13,2.5),(.28,.14,4.6),'bench',.015)
    for y in (-5,-2,1,4):
        cube('hall_side_window',(-7.26,y,2.8),(.04,1.75,2.4),'glass',.03)
        cube('hall_side_mullion',(-7.21,y,2.8),(.05,.08,2.4),'gold',.008)
    ACTIVE='hall_stage'
    cube('stage',(0,3.8,.43),(13.7,4.6,.65),'slate',.07)
    cube('stage_edge',(0,1.48,.54),(13.7,.1,.22),'gold',.015)
    for i in range(3): cube('stage_stairs',(5.8,1.1-i*.3,.44-i*.12),(1.5,.55,.16),'ivory',.025)
    cube('projection_frame',(0,6.0,3.05),(7.8,.2,3.45),'slate')
    cube('projection_screen',(0,5.87,3.05),(7.3,.04,2.95),'cream',.02)
    # An original scientific conference screen composed of clean abstract shapes.
    for x,y,z,r,mat in [(-1.4,5.83,3.3,.45,'teal'),(-.1,5.83,3.75,.28,'gold'),(.4,5.83,2.7,.32,'coral')]:
        cylinder('projected_atom',(x,y,z),r,.025,mat,24,(math.pi/2,0,0))
    beam('projected_molecule',(-1.4,5.79,3.3),(-.1,5.79,3.75),.04,'teal')
    beam('projected_molecule',(-1.4,5.79,3.3),(.4,5.79,2.7),.04,'teal')
    for z,w in [(3.9,1.8),(3.5,1.3),(3.1,1.65),(2.7,1.0)]: cube('projected_title',(2,5.8,z),(w,.025,.09),'slate',.006)
    cube('lectern',(-4.6,2.8,1.32),(1.15,.85,1.65),'coral')
    top=cube('lectern_top',(-4.6,2.8,2.17),(1.4,1.0,.14),'ivory');top.rotation_euler.x=.14
    cylinder('lectern_emblem',(-4.6,2.35,1.5),.22,.035,'gold',16,(math.pi/2,0,0))
    beam('microphone_stand',(-4.55,2.78,2.25),(-4.55,2.67,2.6),.025,'ink')
    beam('microphone',(-4.55,2.67,2.6),(-4.3,2.63,2.6),.035,'ink')
    cube('panel_table',(1.7,3.0,1.18),(5.8,.95,.75),'teal')
    cube('panel_tabletop',(1.7,3.0,1.59),(6.0,1.1,.12),'ivory')
    for x in (-.3,1.0,2.3,3.6):
        cube('panel_namecard',(x,2.52,1.76),(.48,.07,.19),'paper',.01)
        cylinder('water_bottle',(x+.36,2.9,1.81),.065,.31,'water',10)
    ACTIVE='hall_seating'
    for row in range(5):
        y=.2-row*1.15
        for col in range(8):
            x=-5.4+col*1.55
            if col>=4: x+=.3
            cube('auditorium_seat',(x,y,.58),(.88,.78,.18),'coral',.06)
            cube('auditorium_seat_back',(x,y+.3,.95),(.88,.19,.83),'coral',.06)
            for dx in (-.39,.39):
                cube('seat_arm',(x+dx,y,.84),(.1,.7,.08),'slate',.02)
                cube('seat_leg',(x+dx,y,.3),(.08,.5,.45),'slate',.015)
    ACTIVE='hall_people'
    scientist(-4.5,3.6,'navy',book=True,size=1.45,z=.76)
    # Seated delegates have visible heads, shoulders and diverse jackets.
    for row,col in [(0,1),(0,2),(0,4),(0,6),(1,0),(1,3),(1,5),(1,7),(2,1),(2,2),(2,5),(2,6),(3,0),(3,2),(3,4),(3,7),(4,1),(4,4),(4,6)]:
        x=-5.4+col*1.55+(.3 if col>=4 else 0); y=.1-row*1.15
        cylinder('delegate_head',(x,y,1.38),.12,.23,'skin',8)
        ico('delegate_hair',(x,y,1.5),.135,'ink',(1,1,.55),1)
        cube('delegate_jacket',(x,y,1.08),(.38,.3,.39),random.choice(['navy','teal','cream','blue','purple']),.04)
        cube('delegate_notebook',(x,y-.36,.89),(.33,.24,.04),'paper',.01)
    ACTIVE='hall_details'
    for x in (-6.1,6.1):
        cube('stage_planter',(x,3.9,.82),(.6,.6,.65),'cream')
        for dx,dy in [(-.18,0),(.18,.1),(0,-.2)]: ico('stage_plant',(x+dx,3.9+dy,1.45),.36,'hedge',(1,1,1.8),1)
    for x in (-6.5,6.5):
        cube('conference_flag',(x,5.7,2.8),(.9,.1,2.5),'teal')
        cube('flag_gold_mark',(x,5.63,3.2),(.35,.025,.35),'gold')
    lighting(camera=(18,-22,19),target=(0,.3,1.2),ortho=22)
    export('conference',render)



def classroom_interior(render=True):
    global ACTIVE
    setup_scene('Daxia · Teaching & Department')
    ACTIVE='classroom_room'
    cube('classroom_base',(0,0,-.28),(14.4,11.4,.65),'slatedark',.2)
    cube('classroom_floor',(0,0,.09),(14,11,.15),'pavinglight',.04)
    cube('classroom_back_wall',(0,5.35,2.3),(14,.22,4.5),'ivory')
    cube('classroom_left_wall',(-6.9,0,2.3),(.2,11,4.5),'ivory')
    for y in (-3.4,-.4,2.6):
        cube('lecture_window',(-6.76,y,2.65),(.04,2.0,2.3),'glass',.03)
        cube('lecture_window_vertical',(-6.7,y,2.65),(.07,.06,2.3),'cream',.01)
        cube('lecture_window_horizontal',(-6.7,y,2.65),(.07,2.0,.06),'cream',.01)
        cube('window_sill',(-6.65,y,1.45),(.25,2.2,.1),'cream',.01)
    for x in range(-6,7): cube('classroom_floor_line',(x,0,.17),(.012,10.7,.006),'stone',0)
    ACTIVE='classroom_teaching'
    cube('teacher_platform',(0,3.45,.29),(12.4,2.8,.25),'bench',.04)
    cube('chalkboard_frame',(-.6,5.12,2.55),(8.8,.15,2.5),'bench',.03)
    cube('chalkboard',(-.6,5.02,2.55),(8.4,.05,2.18),'hedge',.015)
    cube('chalk_tray',(-.6,4.95,1.38),(8.7,.22,.08),'slate',.015)
    # A connected scientific chalk drawing, equation strokes and a response curve.
    for x,z,r in [(-3.45,2.8,.27),(-2.5,3.18,.19),(-2.4,2.26,.21),(-1.5,2.64,.18)]:
        torus('chalk_atom',(x,4.97,z),r,.022,'paper',(math.pi/2,0,0))
    for a,b in [((-3.18,2.83),(-2.68,3.1)),((-3.23,2.61),(-2.58,2.37)),((-2.23,2.32),(-1.68,2.58)),((-2.31,3.07),(-1.64,2.8))]:
        beam('chalk_bond',(a[0],4.94,a[1]),(b[0],4.94,b[1]),.018,'paper')
    for x in (-3.8,-3.3,-2.8,-2.3,-1.8):
        cube('chalk_equation_stroke',(x,4.94,1.8),(.27,.02,.035),'paper',0)
    beam('lecture_plot_axis',(0,4.94,1.78),(2.8,4.94,1.78),.018,'paper')
    beam('lecture_plot_axis',(0,4.94,1.78),(0,4.94,3.37),.018,'paper')
    trace=[(0,1.9),(.4,1.99),(.8,2.28),(1.25,2.91),(1.65,3.2),(2.1,3.28),(2.6,3.29)]
    for a,b in zip(trace[:-1],trace[1:]): beam('lecture_result_trace',(a[0],4.94,a[1]),(b[0],4.94,b[1]),.025,'gold')
    for z,w in [(3.3,1.1),(3.0,.75),(2.7,1.0)]: cube('chalk_note',(4.4,4.94,z),(w,.025,.05),'paper',.005)
    # Wheeled demonstration desk and a lectern with laptop and reading notes.
    cube('teaching_desk',(-.2,3.38,1.05),(4.1,1.05,1.2),'teal')
    cube('teaching_desktop',(-.2,3.38,1.72),(4.35,1.23,.15),'cream',.045)
    cube('teacher_laptop_base',(-.9,3.25,1.83),(.78,.52,.045),'slate',.015)
    laptop=cube('teacher_laptop_screen',(-.9,3.52,2.08),(.78,.05,.48),'slate',.02)
    laptop.rotation_euler.x=-.12
    cube('teacher_screen_glow',(-.9,3.48,2.08),(.66,.02,.36),'screen',.01)
    cube('teacher_lecture_notes',(.65,3.15,1.83),(.6,.46,.035),'paper',.005)
    cylinder('teacher_mug',(1.25,3.45,1.96),.105,.3,'coral',12)
    # Wooden lectern at the left, deliberately lower than the speaker.
    cube('lecture_lectern',(-4.3,3.1,1.1),(1.05,.8,1.4),'coral')
    lectern=cube('lecture_lectern_top',(-4.3,3.1,1.85),(1.25,.95,.12),'cream');lectern.rotation_euler.x=.1
    beam('lecture_microphone',(-4.15,3.1,1.94),(-3.95,3.0,2.2),.022,'ink')
    # A ceiling-mounted projector is anchored to the back wall to leave the room open.
    beam('projector_mount',(0,5.2,4.2),(0,1.4,4.2),.045,'stone')
    cube('ceiling_projector',(0,1.4,4.05),(.85,.65,.27),'cream',.05)
    cylinder('projector_lens',(0,1.05,4.05),.12,.1,'glass',16,(math.pi/2,0,0))
    ACTIVE='classroom_students'
    for row in range(4):
        yy=.65-row*1.27
        for col in range(6):
            xx=-4.85+col*1.82+(.26 if col>=3 else 0)
            cube('student_desk',(xx,yy,.96),(1.55,.6,.13),'bench',.035)
            for dx in (-.6,.6):
                cube('desk_metal_leg',(xx+dx,yy,.54),(.06,.43,.8),'slate',.01)
                cube('desk_metal_foot',(xx+dx,yy-.05,.2),(.09,.7,.07),'slate',.01)
            cube('student_chair_seat',(xx,yy-.63,.57),(.68,.65,.14),'teal',.045)
            cube('student_chair_back',(xx,yy-.93,.9),(.68,.14,.72),'teal',.04)
            for dx in (-.25,.25): cube('student_chair_leg',(xx+dx,yy-.63,.35),(.05,.47,.55),'slate',.008)
            occupied=(row+col)%5!=1
            if occupied:
                cylinder('student_head',(xx,yy-.56,1.52),.13,.25,'skin',8)
                ico('student_hair',(xx,yy-.56,1.66),.145,'ink',(1,1,.6),1)
                cube('student_shirt',(xx,yy-.58,1.18),(.4,.31,.43),['navy','coral','cream','blue','purple','teal'][(row+col)%6],.035)
                cube('student_notebook',(xx,yy-.07,1.05),(.43,.32,.035),'paper',.008)
                for dx in (-.26,.26): beam('student_forearm',(xx+dx,yy-.49,1.28),(xx+dx,yy-.14,1.12),.055,'skin')
            elif (row+col)%2:
                cube('student_book_stack',(xx+.1,yy,1.09),(.55,.4,.12),'coral',.02)
    ACTIVE='classroom_department'
    # One door and a noticeboard evoke the teaching office and departmental corridor.
    cube('department_office_frame',(5.72,5.12,1.7),(1.75,.2,3.0),'bench')
    cube('department_office_door',(5.72,4.99,1.7),(1.48,.06,2.72),'teal')
    cube('department_door_window',(5.72,4.94,2.25),(.8,.03,.8),'glass')
    cube('department_office_sign',(5.72,4.9,3.38),(1.65,.06,.27),'slate')
    for dx in (-.45,0,.45): cube('office_sign_letters',(5.72+dx,4.85,3.38),(.15,.025,.1),'gold',.005)
    cylinder('department_door_handle',(6.23,4.89,1.55),.045,.09,'gold',10,(math.pi/2,0,0))
    cube('course_noticeboard',(-6.7,-4.2,2.6),(.12,1.7,1.35),'slate')
    for y,z,col in [(-4.6,2.9,'paper'),(-4.0,2.9,'gold'),(-4.6,2.3,'paper'),(-4.0,2.3,'paper')]:
        cube('teaching_notice',(-6.61,y,z),(.03,.46,.45),col,.01)
    cube('lecture_bookshelf',(5.7,3.7,1.1),(1.1,1.1,1.8),'bench')
    for z in (.55,1.1,1.65):
        cube('bookshelf_shelf',(5.7,3.1,z),(1.05,.07,.08),'ivory')
        for i in range(5): cube('course_books',(5.33+i*.18,3.25,z+.22),(.12,.35,.4),['teal','coral','gold','cream','blue'][i],.008)
    ACTIVE='classroom_teacher'
    scientist(-4.3,3.95,'navy',book=True,size=1.6,z=.43)
    scientist(5.15,1.75,'cream',book=True,size=1.5,z=.17)
    lighting(camera=(17,-20,17),target=(0,.2,1.2),ortho=20.4)
    export('classroom',render)


def main():
    args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
    p=argparse.ArgumentParser();p.add_argument('--scene',choices=['all','campus','laboratory','conference','classroom'],default='all');p.add_argument('--no-render',action='store_true')
    opts=p.parse_args(args)
    for name,fn in [('campus',campus),('laboratory',lab_interior),('conference',conference_interior),('classroom',classroom_interior)]:
        if opts.scene in ('all',name): fn(not opts.no_render)

if __name__=='__main__': main()
