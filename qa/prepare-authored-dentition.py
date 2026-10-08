"""Create a review candidate from the CC0 MakeHuman authored dental surfaces."""
import pathlib,json,struct,collections,math
import numpy as np
path=pathlib.Path('assets/models/makehuman/teeth_base.obj')
lines=path.read_text(encoding='utf-8').splitlines()
v=np.array([[float(x) for x in l.split()[1:]] for l in lines if l.startswith('v ')])
faces=[[int(x.split('/')[0])-1 for x in l.split()[1:]] for l in lines if l.startswith('f ')]
parent=list(range(len(v)))
def root(i):
 while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
 return i
for f in faces:
 for i in f[1:]:parent[root(i)]=root(f[0])
groups=collections.defaultdict(list)
for i in range(len(v)):groups[root(i)].append(i)
components=[ids for ids in groups.values() if len(ids)==63]
# The OBJ has two explicit tooth arches. Preserve its tooth forms and arrangement.
lower=components[:16];upper=components[16:]
center=v[np.concatenate(components)].mean(0)
# Correct the common anatomical pose, preserving the relationship of the two arches.
a=-.24;c,s=math.cos(a),math.sin(a);rotation=np.array([[1,0,0],[0,c,-s],[0,s,c]])

def subdivide(verts,polygons):
 fp=np.array([verts[f].mean(0) for f in polygons]);edges={};vf=[[] for _ in verts]
 for fi,f in enumerate(polygons):
  for i in f:vf[i].append(fi)
  for a,b in zip(f,f[1:]+f[:1]):edges.setdefault(tuple(sorted((a,b))),[]).append(fi)
 ep={};new=[];boundary=collections.defaultdict(list);ve=collections.defaultdict(list)
 for (a,b),fs in edges.items():
  ve[a].append((a,b));ve[b].append((a,b))
  if len(fs)==1:boundary[a].append(b);boundary[b].append(a)
 for i,p in enumerate(verts):
  if i in boundary:new.append(.75*p+.125*sum(verts[j] for j in boundary[i]))
  else:
   n=len(vf[i]);f=fp[vf[i]].mean(0);r=np.array([(verts[a]+verts[b])/2 for a,b in ve[i]]).mean(0);new.append((f+2*r+(n-3)*p)/n)
 for edge,fs in edges.items():
  ep[edge]=len(new);a,b=edge;new.append((verts[a]+verts[b]+sum(fp[f] for f in fs))/4 if len(fs)==2 else (verts[a]+verts[b])/2)
 start=len(new);new.extend(fp);result=[]
 for fi,f in enumerate(polygons):
  for k,i in enumerate(f):result.append([i,ep[tuple(sorted((i,f[(k+1)%len(f)])))],start+fi,ep[tuple(sorted((f[(k-1)%len(f)],i)))]] )
 return np.array(new),result

meshes=[]
# Identify each authored tooth by its position along its own side of the arch.
orders={}
for row_start in (0,16):
 for sign in (-1,1):
  side=[n for n in range(row_start,row_start+16) if np.sign(v[components[n]].mean(0)[0])==sign]
  for order,n in enumerate(sorted(side,key=lambda n:-v[components[n]].mean(0)[2]),1):orders[n]=order

for n,ids in enumerate(components):
 mapping={old:i for i,old in enumerate(ids)};p=(v[ids]-center)@rotation.T;f=[[mapping[i] for i in face] for face in faces if face[0] in mapping]
 for _ in range(2):p,f=subdivide(p,f)
 # Add restrained occlusal relief where the render asset is deliberately low detail.
 if orders[n]>=4:
  direction=1 if n<16 else -1
  crown_y=p[:,1]*direction;top=crown_y.max();mask=np.clip((crown_y-(top-.028))/.024,0,1)
  occlusal=p[crown_y>top-.020];mid=occlusal.mean(0)
  radial=np.array([mid[0],mid[2]+.12]);radial/=np.linalg.norm(radial);tangent=np.array([radial[1],-radial[0]])
  rel=p[:,[0,2]]-mid[[0,2]];u=rel@tangent;w=rel@radial
  u/=max(np.max(np.abs((occlusal[:,[0,2]]-mid[[0,2]])@tangent)),.001)
  w/=max(np.max(np.abs((occlusal[:,[0,2]]-mid[[0,2]])@radial)),.001)
  if orders[n]>=6:
   cusps=sum(np.exp(-((u-a)**2+(w-b)**2)/.12) for a,b in [(-.46,-.45),(.46,-.45),(-.46,.45),(.46,.45)])
   groove=(np.exp(-(u/.12)**2)+np.exp(-(w/.12)**2))*.0015
   relief=.0055*cusps-groove-.0018*np.exp(-(u*u+w*w)/.16)
  else:
   cusps=sum(np.exp(-((u-a)**2+(w-b)**2)/.15) for a,b in [(0,-.48),(0,.48)])
   relief=.005*cusps-.0025*np.exp(-(w/.12)**2)
  edge=np.clip((1.08-np.maximum(np.abs(u),np.abs(w)))/.28,0,1)
  p[:,1]+=direction*mask*edge*relief
 tri=np.array([[face[0],face[i],face[i+1]] for face in f for i in range(1,len(face)-1)],dtype=np.uint16)
 # Open the display slightly for clear separation between the upper and lower teeth.
 p[:,1]+=(.016 if n>=16 else -.016)
 meshes.append((('upper' if n>=16 else 'lower')+f'-tooth-{n%16+1:02d}',p,tri))

def export(path,parts):
 chunks=[];views=[];access=[];gmeshes=[];nodes=[]
 for name,p,f in parts:
  normals=np.zeros_like(p);xyz=p[f];fn=np.cross(xyz[:,1]-xyz[:,0],xyz[:,2]-xyz[:,0])
  for k in range(3):np.add.at(normals,f[:,k],fn)
  normals/=np.maximum(np.linalg.norm(normals,axis=1)[:,None],1e-12)
  attrs={}
  for key,arr,typ,ct in [('POSITION',p.astype('<f4'),'VEC3',5126),('NORMAL',normals.astype('<f4'),'VEC3',5126),('index',f.astype('<u2').ravel(),'SCALAR',5123)]:
   data=arr.tobytes();views.append({'buffer':0,'byteOffset':sum(map(len,chunks)),'byteLength':len(data)});chunks.append(data+b'\0'*((-len(data))%4));acc={'bufferView':len(views)-1,'componentType':ct,'count':len(arr),'type':typ}
   if key=='POSITION':acc.update(min=p.min(0).tolist(),max=p.max(0).tolist())
   access.append(acc);attrs[key]=len(access)-1
  gmeshes.append({'name':name,'primitives':[{'attributes':{'POSITION':attrs['POSITION'],'NORMAL':attrs['NORMAL']},'indices':attrs['index']}]});nodes.append({'name':name,'mesh':len(gmeshes)-1})
 blob=b''.join(chunks);j={'asset':{'version':'2.0','copyright':'MakeHuman system teeth_base, CC0. Display orientation and subdivision by MyDentist.'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':gmeshes,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':access};header=json.dumps(j).encode();header+=b' '*((-len(header))%4);out=struct.pack('<III',0x46546c67,2,28+len(header)+len(blob))+struct.pack('<II',len(header),0x4e4f534a)+header+struct.pack('<II',len(blob),0x004e4942)+blob
 pathlib.Path(path).parent.mkdir(parents=True,exist_ok=True);pathlib.Path(path).write_bytes(out);print(path,len(out))
export('qa/model-candidates/authored-dentition.glb',meshes)
export('qa/model-candidates/authored-scan.glb',meshes[:16])

ids=max(groups.values(),key=len);mapping={old:i for i,old in enumerate(ids)};p=(v[ids]-center)@rotation.T;f=[[mapping[i] for i in face] for face in faces if face[0] in mapping]
p,f=subdivide(p,f)
tri=np.array([[face[0],face[i],face[i+1]] for face in f for i in range(1,len(face)-1)],dtype=np.uint16)
def clip(points, faces, lo, hi):
 result=[]
 for face in faces:
  poly=[points[i] for i in face]
  for axis,cut,above in [(1,lo,True),(1,hi,False),(2,-.272,True)]:
   out=[]
   for a,b in zip(poly,poly[1:]+poly[:1]):
    ain=a[axis]>=cut if above else a[axis]<=cut;bin=b[axis]>=cut if above else b[axis]<=cut
    if ain:out.append(a)
    if ain!=bin:out.append(a+(b-a)*(cut-a[axis])/(b[axis]-a[axis]))
   poly=out
  for k in range(1,len(poly)-1):result.extend([poly[0],poly[k],poly[k+1]])
 vertices,indices=np.unique(np.round(np.array(result),7),axis=0,return_inverse=True)
 return vertices,indices.reshape(-1,3).astype(np.uint16)
up,uf=clip(p,tri,.014,.115);up[:,1]+=.016
low,lf=clip(p,tri,-.110,-.014);low[:,1]-=.016
export('qa/model-candidates/authored-full.glb',meshes+[('gingiva-upper',up,uf),('gingiva-lower',low,lf)])
export('qa/model-candidates/authored-scan-gum.glb',meshes[:16]+[('gingiva-lower',low,lf)])

export('public/models/technology-dentition.glb',meshes+[('gingiva-upper',up,uf),('gingiva-lower',low,lf)])
export('public/models/technology-scan.glb',meshes[:16]+[('gingiva-lower',low,lf)])
