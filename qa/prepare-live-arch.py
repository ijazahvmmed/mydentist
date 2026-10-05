import json,struct,pathlib
m=json.loads(pathlib.Path('assets/models/manifest.json').read_text());b=pathlib.Path('assets/models/dental.bin').read_bytes();parts=[p for p in m['parts'] if p['source']=='diaz' and p['group']=='tooth'];chunks=[];views=[];access=[];meshes=[];nodes=[]
for part in parts:
 attrs={}
 for key in ['positions','indices']:
  n=part['vertexCount'] if key=='positions' else part['indexCount'];src=b[part[key]:part[key]+n*(12 if key=='positions' else 4)];data=src if key=='positions' else struct.pack('<'+str(n)+'H',*struct.unpack('<'+str(n)+'I',src));offset=sum(map(len,chunks));views.append({'buffer':0,'byteOffset':offset,'byteLength':len(data)});chunks.append(data+b'\0'*((-len(data))%4));a={'bufferView':len(views)-1,'componentType':5126 if key=='positions' else 5123,'count':n,'type':'VEC3' if key=='positions' else 'SCALAR'}
  if key=='positions':a.update(min=part['bounds'][0],max=part['bounds'][1])
  access.append(a);attrs[key]=len(access)-1
 meshes.append({'name':part['id'],'primitives':[{'attributes':{'POSITION':attrs['positions']},'indices':attrs['indices']}]});nodes.append({'mesh':len(meshes)-1})
binary=b''.join(chunks);j={'asset':{'version':'2.0','copyright':'Diaz et al. 2024 CC BY 4.0; external lower dentition study'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':access};s=json.dumps(j).encode();s+=b' '*((-len(s))%4);out=struct.pack('<III',0x46546c67,2,28+len(s)+len(binary))+struct.pack('<II',len(s),0x4e4f534a)+s+struct.pack('<II',len(binary),0x004e4942)+binary;pathlib.Path('public/models/dental-arch.glb').write_bytes(out);print(len(out))
