import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
try{
const page=await browser.newPage({viewport:{width:1200,height:650}});await page.goto('http://localhost:4323/');
const data=(await readFile('qa/model-candidates/authored-scan-gum.glb')).toString('base64');
await page.evaluate(async data=>{
const T=await import('/node_modules/three/build/three.module.js');const {GLTFLoader}=await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
document.body.innerHTML='<div id="views" style="display:flex;background:#112b43"></div>';document.body.style.margin='0';
const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));const gltf=await new GLTFLoader().parseAsync(bytes.buffer,'');
for(const angle of [0,.6]){
 const scene=new T.Scene();const group=gltf.scene.clone(true);group.traverse(n=>{if(n.isMesh)n.material=new T.MeshStandardMaterial({color:n.name.startsWith('gingiva')?'#405b71':'#e2edf0',roughness:n.name.startsWith('gingiva')?.7:.32})});
 const box=new T.Box3().setFromObject(group);group.position.sub(box.getCenter(new T.Vector3()));const wrap=new T.Group();wrap.add(group);wrap.scale.setScalar(5/box.getSize(new T.Vector3()).x);wrap.rotation.y=angle;scene.add(wrap);
 const camera=new T.OrthographicCamera(-3.5,3.5,3.8,-3.8,.1,100);camera.position.set(0,9,6);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setSize(600,650);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;document.querySelector('#views').appendChild(renderer.domElement);
 scene.add(new T.HemisphereLight('#e8f7ff','#335572',2));const key=new T.DirectionalLight('#ffffff',2.5);key.position.set(-3,5,6);scene.add(key);renderer.render(scene,camera);
}
},data);
await page.screenshot({path:'qa/screenshots/authored-teeth/scan-model.png'});
}finally{await browser.close();}
