import json,pathlib,struct
m=json.loads(pathlib.Path('assets/models/manifest.json').read_text());b=pathlib.Path('assets/models/dental.bin').read_bytes()
for name in ['tooth-36','tooth-37','tooth-46','tooth-47']:
 part=next(x for x in m['parts'] if x['id']==name);chunks=[];views=[];access=[]
 for key,typ,n,ct in [('positions','VEC3',part['vertexCount'],5126),('normals','VEC3',part['vertexCount'],5126),('indices','SCALAR',part['indexCount'],5125)]:
  size=n*(3 if typ=='VEC3' else 1)*4;data=b[part[key]:part[key]+size];views.append({'buffer':0,'byteOffset':sum(map(len,chunks)),'byteLength':len(data)});chunks.append(data);a={'bufferView':len(views)-1,'componentType':ct,'count':n,'type':typ}
  if key=='positions':a.update(min=part['bounds'][0],max=part['bounds'][1])
  access.append(a)
 binary=b''.join(chunks);j={'asset':{'version':'2.0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2}]}],'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':access};s=json.dumps(j).encode();s+=b' '*((-len(s))%4);glb=struct.pack('<III',0x46546c67,2,12+8+len(s)+8+len(binary))+struct.pack('<II',len(s),0x4e4f534a)+s+struct.pack('<II',len(binary),0x004e4942)+binary;pathlib.Path(f'public/models/{name}.glb').write_bytes(glb)
