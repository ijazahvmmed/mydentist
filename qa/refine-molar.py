"""Refine a licensed external surface with one Loop subdivision; no internal anatomy."""
import json,struct,pathlib,math
m=json.loads(pathlib.Path('assets/models/manifest.json').read_text());b=pathlib.Path('assets/models/dental.bin').read_bytes();part=next(x for x in m['parts'] if x['id']=='tooth-36');raw=struct.unpack_from('<'+str(part['vertexCount']*3)+'f',b,part['positions']);v=[raw[i:i+3] for i in range(0,len(raw),3)];rawi=struct.unpack_from('<'+str(part['indexCount'])+'I',b,part['indices']);faces=[rawi[i:i+3] for i in range(0,len(rawi),3)]
neighbours=[set() for _ in v];edges={}
for a,c,d in faces:
 for x,y,o in [(a,c,d),(c,d,a),(d,a,c)]:
  neighbours[x].add(y);neighbours[y].add(x);edges.setdefault(tuple(sorted((x,y))),[]).append(o)
refined=[]
for i,p in enumerate(v):
 n=len(neighbours[i]);beta=3/16 if n==3 else 3/(8*n);refined.append(tuple((1-n*beta)*p[k]+beta*sum(v[j][k] for j in neighbours[i]) for k in range(3)))
edgeids={}
for (a,c),op in edges.items():
 edgeids[a,c]=len(refined)
 refined.append(tuple((3/8*(v[a][k]+v[c][k])+1/8*(v[op[0]][k]+v[op[1]][k])) if len(op)==2 else (v[a][k]+v[c][k])/2 for k in range(3)))
indices=[]
for a,c,d in faces:
 ac=edgeids[tuple(sorted((a,c)))];cd=edgeids[tuple(sorted((c,d)))];da=edgeids[tuple(sorted((d,a)))];indices.extend([a,ac,da,c,cd,ac,d,da,cd,ac,cd,da])
positions=struct.pack('<'+str(len(refined)*3)+'f',*(x for p in refined for x in p));ind=struct.pack('<'+str(len(indices))+'H',*indices);binary=positions+ind;binary+=b'\0'*((-len(binary))%4)
j={'asset':{'version':'2.0','copyright':'Diaz et al. 2024 CC BY 4.0. External molar 36, Loop-refined by MyDentist website project.'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'primitives':[{'attributes':{'POSITION':0},'indices':1}]}],'buffers':[{'byteLength':len(binary)}],'bufferViews':[{'buffer':0,'byteOffset':0,'byteLength':len(positions)},{'buffer':0,'byteOffset':len(positions),'byteLength':len(ind)}],'accessors':[{'bufferView':0,'componentType':5126,'count':len(refined),'type':'VEC3','min':[min(p[i] for p in refined) for i in range(3)],'max':[max(p[i] for p in refined) for i in range(3)]},{'bufferView':1,'componentType':5123,'count':len(indices),'type':'SCALAR'}]}
s=json.dumps(j).encode();s+=b' '*((-len(s))%4);out=struct.pack('<III',0x46546c67,2,28+len(s)+len(binary))+struct.pack('<II',len(s),0x4e4f534a)+s+struct.pack('<II',len(binary),0x004e4942)+binary
pathlib.Path('public/models/refined-molar.glb').write_bytes(out);print({'vertices':len(refined),'triangles':len(indices)//3,'bytes':len(out)})
