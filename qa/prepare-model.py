import urllib.request,json,pathlib,struct
base='https://raw.githubusercontent.com/choxos/OMFAtlas/main/public/models/dental/'
p=pathlib.Path('assets/models')
for name in ['manifest.json','dental.bin','ATTRIBUTION.md']:
 urllib.request.urlretrieve(base+name,p/name)
m=json.loads((p/'manifest.json').read_text()); b=(p/'dental.bin').read_bytes(); part=next(x for x in m['parts'] if x['id']=='tooth-36')
print(part)
chunks=[]; views=[]; access=[]
for key,typ,n,ct in [('positions','VEC3',part['vertexCount'],5126),('normals','VEC3',part['vertexCount'],5126),('indices','SCALAR',part['indexCount'],5125)]:
 size=n*(3 if typ=='VEC3' else 1)*4; off=part[key]; data=b[off:off+size]; views.append({'buffer':0,'byteOffset':sum(map(len,chunks)),'byteLength':len(data)}); chunks.append(data)
 a={'bufferView':len(views)-1,'componentType':ct,'count':n,'type':typ}
 if key=='positions': a.update(min=part['bounds'][0],max=part['bounds'][1])
 access.append(a)
bin=b''.join(chunks)
j={'asset':{'version':'2.0','copyright':'Diaz et al. 2024, CC BY 4.0; source DOI 10.17632/xjsx7nfhj8.1'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'name':'External molar 36','primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2}]}],'buffers':[{'byteLength':len(bin)}],'bufferViews':views,'accessors':access}
s=json.dumps(j,separators=(',',':')).encode(); s+=b' '*((-len(s))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(s)+8+len(bin))+struct.pack('<II',len(s),0x4e4f534a)+s+struct.pack('<II',len(bin),0x004e4942)+bin
pathlib.Path('public/models/external-molar.glb').write_bytes(glb)
