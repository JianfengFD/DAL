import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { icon } from './icons.js';

const BUILDINGS = {
 academy:{name:'教学楼 · 院系',icon:'teach'},lab:{name:'格物实验楼',icon:'flask'},foundation:{name:'自然基金委',icon:'fund'},library:{name:'知微图书馆',icon:'book'},conference:{name:'群贤会议中心',icon:'mic'},dorm:{name:'学者公寓',icon:'home'},cafe:{name:'未名咖啡',icon:'coffee'},admin:{name:'校务行政楼',icon:'folder'}
};
export class CampusWorld {
 constructor(container,onSelect){this.container=container;this.onSelect=onSelect;this.labels=[];this.selected=null;this.mode='campus';this.disposed=false;this.labelsVisible=true;this.sceneCache={};this.init().catch(e=>this.fallback(e));}
 async init(){
  this.scene=new THREE.Scene();
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.38;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.renderer.setClearColor(0xe3e7d7,0);this.container.prepend(this.renderer.domElement);
  this.camera=new THREE.OrthographicCamera(-20,20,20,-20,.1,250);
  this.camera.position.set(32,33,39);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);
  this.controls.enableDamping=true;this.controls.dampingFactor=.08;
  this.controls.enablePan=false;this.controls.minPolarAngle=.45;this.controls.maxPolarAngle=1.17;
  this.controls.minZoom=.68;this.controls.maxZoom=2.1;this.controls.rotateSpeed=.4;this.controls.zoomSpeed=.65;
  this.controls.target.set(0,0,0);
  this.controls.addEventListener('change',()=>this.updateLabels());
  const ambient=new THREE.AmbientLight(0xfff6da,.9);this.scene.add(ambient);
  this.scene.add(new THREE.HemisphereLight(0xe9f2e5,0x647263,2.2));
  this.sun=new THREE.DirectionalLight(0xffe6b5,3.4);this.sun.position.set(-16,30,16);this.sun.castShadow=true;
  this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:90});
  this.sun.shadow.normalBias=.04;this.sun.shadow.bias=-.0003;this.scene.add(this.sun);
  const fill=new THREE.DirectionalLight(0xb5d8d2,.65);fill.position.set(20,12,-20);this.scene.add(fill);
  this.loader=new GLTFLoader();
  const [gltf,meta]=await Promise.all([this.loader.loadAsync('./assets/campus.glb'),fetch('./assets/campus.json').then(r=>r.json())]);
  this.meta=meta;this.campus=gltf.scene;this.sceneCache.campus=gltf.scene;
  gltf.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  this.scene.add(gltf.scene);
  this.createLabels(meta.buildings||[]);
  this.targetRing=new THREE.Mesh(new THREE.RingGeometry(2.2,2.29,64),new THREE.MeshBasicMaterial({color:0xdcb55f,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
  this.targetRing.rotation.x=-Math.PI/2;this.targetRing.position.y=.53;this.targetRing.visible=false;this.scene.add(this.targetRing);this.select(this.selected||'academy');
  this.createDust();
  this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
  this.renderer.domElement.addEventListener('pointerdown',e=>this.pointerStart=[e.clientX,e.clientY]);
  this.renderer.domElement.addEventListener('pointerup',e=>{if(this.mode!=='campus'||!this.pointerStart||Math.hypot(e.clientX-this.pointerStart[0],e.clientY-this.pointerStart[1])>7)return;const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);const hits=this.raycaster.intersectObject(this.campus,true);for(const h of hits){let o=h.object;while(o){const match=o.name.match(/^building_(academy|lab|foundation|library|conference|dorm|cafe|admin)/);if(match){this.select(match[1]);this.onSelect(match[1]);return;}o=o.parent;}}});
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.container);
  this.resize();this.controls.update();this.renderer.compile(this.scene,this.camera);
  document.querySelector('#scene-loading')?.remove();
  this.animate();
 }
 createLabels(buildings){const root=document.querySelector('#building-labels');root.innerHTML='';buildings.forEach(b=>{const def=BUILDINGS[b.id]||{name:b.name,icon:'campus'};const el=document.createElement('button');el.className='building-label';el.dataset.building=b.id;el.setAttribute('aria-label',`进入${def.name}`);el.innerHTML=`${icon(def.icon)}<span>${def.name}</span><i class="label-dot"></i>`;el.addEventListener('click',()=>{this.select(b.id);this.onSelect(b.id);});root.append(el);this.labels.push({id:b.id,anchor:new THREE.Vector3(...b.labelAnchor),el});});}
 createDust(){const count=45,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*38;positions[i*3+1]=Math.random()*9+1;positions[i*3+2]=(Math.random()-.5)*31;}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));this.dust=new THREE.Points(g,new THREE.PointsMaterial({color:0xe9cb77,size:.04,transparent:true,opacity:.55,sizeAttenuation:true,depthWrite:false}));this.scene.add(this.dust);}
 select(id){this.selected=id;this.labels.forEach(l=>l.el.classList.toggle('selected',l.id===id));const b=this.meta?.buildings.find(b=>b.id===id);if(this.targetRing&&b&&this.mode==='campus'){const radius=({academy:4.6,lab:4.6,foundation:4.4,library:3.8,conference:4.0,dorm:3.6,cafe:3.2,admin:3.9})[id]||4;this.targetRing.geometry.dispose();this.targetRing.geometry=new THREE.RingGeometry(radius,radius+.075,64);this.targetRing.position.set(b.center[0],.53,b.center[2]);this.targetRing.visible=true;}}
 resize(){if(!this.renderer)return;const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);const aspect=w/h;let size=Math.max(19.8,24/aspect);this.camera.left=-size*aspect;this.camera.right=size*aspect;this.camera.top=size;this.camera.bottom=-size;this.camera.updateProjectionMatrix();this.updateLabels();}
 updateLabels(){if(!this.camera)return;const w=this.container.clientWidth,h=this.container.clientHeight;this.labels.forEach(l=>{const p=l.anchor.clone().project(this.camera);const x=(p.x*.5+.5)*w,y=(-p.y*.5+.5)*h;const visible=this.labelsVisible&&this.mode==='campus'&&p.z<1&&x>20&&x<w-20&&y>10&&y<h-15;l.el.style.display=visible?'flex':'none';l.el.style.left=`${x}px`;l.el.style.top=`${y}px`;});}
 rotate(direction){if(!this.controls)return;const offset=this.camera.position.clone().sub(this.controls.target);const spherical=new THREE.Spherical().setFromVector3(offset);spherical.theta+=direction*.28;this.camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(this.controls.target));this.controls.update();}
 reset(){if(!this.camera)return;if(this.mode!=='campus'){this.switchScene('campus');return;}this.camera.position.set(32,33,39);this.controls.target.set(0,0,0);this.camera.zoom=1;this.camera.updateProjectionMatrix();this.controls.update();}
 async switchScene(mode){if(!this.scene)return false;if(mode===this.mode)return true;try{if(!this.sceneCache[mode]){const g=await this.loader.loadAsync(`./assets/${mode}.glb`);g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});this.sceneCache[mode]=g.scene;}Object.values(this.sceneCache).forEach(s=>this.scene.remove(s));this.scene.add(this.sceneCache[mode]);this.mode=mode;this.targetRing.visible=false;this.dust.visible=mode==='campus';if(mode==='campus'){this.camera.position.set(32,33,39);this.controls.target.set(0,0,0);this.camera.zoom=1;}else{this.camera.position.set(17,18,22);this.controls.target.set(0,0,0);this.camera.zoom=2.15;}this.camera.updateProjectionMatrix();this.controls.update();this.updateLabels();return true;}catch(e){console.warn('Scene load failed',e);return false;}}
 async setSeason(season){if(!this.sun)return;const index=typeof season==='number'?season:['春','夏','秋','冬'].findIndex(s=>String(season).includes(s));const colors=[0xffe6b5,0xfaf4d1,0xffce96,0xe3e9ff];this.sun.color.setHex(colors[index>=0?index:0]);if(this.dust)this.dust.material.color.setHex(index===3?0xf1f5e4:0xe9cb77);}
 animate(){if(this.disposed)return;requestAnimationFrame(()=>this.animate());if(document.hidden)return;this.controls?.update();if(this.dust?.visible){this.dust.rotation.y+=.0002;this.dust.position.y=Math.sin(performance.now()*.00018)*.4;}if(this.targetRing?.visible)this.targetRing.material.opacity=.55+Math.sin(performance.now()*.002)*.2;this.renderer.render(this.scene,this.camera);}
 setLabelsVisible(v){this.labelsVisible=v;this.updateLabels();}
 fallback(error){console.warn('Campus WebGL fallback:',error);document.querySelector('#scene-loading')?.remove();const panel=document.querySelector('#scene-container');panel.style.background='url("./assets/campus-preview.png") center 65% / contain no-repeat';const root=document.querySelector('#building-labels');root.innerHTML='';Object.entries(BUILDINGS).forEach(([id,b],i)=>{const el=document.createElement('button');el.className='building-label';el.style.left=`${20+(i%3)*29}%`;el.style.top=`${36+Math.floor(i/3)*19}%`;el.innerHTML=icon(b.icon)+b.name;el.addEventListener('click',()=>{this.onSelect(id);this.select(id);});root.append(el);});document.querySelector('#scene-unavailable').hidden=true;}
}
