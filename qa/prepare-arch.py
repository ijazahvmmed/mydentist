import json,struct,math,pathlib
p=pathlib.Path('assets/models');m=json.loads((p/'manifest.json').read_text());b=(p/'dental.bin').read_bytes()
parts=[x for x in m['parts'] if x['source']=='diaz' and x['group']=='tooth']
allpts=[]; teeth=[]
for part in parts:
 n=part['vertexCount'];raw=struct.unpack_from('<'+str(n*3)+'f',b,part['positions']);pts=[raw[i:i+3] for i in range(0,len(raw),3)];teeth.append((part,pts));allpts+=pts
mins=[min(v[i] for v in allpts) for i in range(3)];maxs=[max(v[i] for v in allpts) for i in range(3)];center=[(a+c)/2 for a,c in zip(mins,maxs)]
def proj(v):
 x,y,z=[v[i]-center[i] for i in range(3)];return (300+x*7,190-y*3.8-z*3.0)
def hull(points):
 points=sorted(set(points))
 def cross(o,a,b):return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
 lo=[];hi=[]
 for x in points:
  while len(lo)>=2 and cross(lo[-2],lo[-1],x)<=0:lo.pop()
  lo.append(x)
 for x in reversed(points):
  while len(hi)>=2 and cross(hi[-2],hi[-1],x)<=0:hi.pop()
  hi.append(x)
 return lo[:-1]+hi[:-1]
svg=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="enamel" x2=".6" y2="1"><stop stop-color="#eefcff"/><stop offset="1" stop-color="#6b9caa"/></linearGradient></defs><g transform="translate(0 18)">']
for part,pts in sorted(teeth,key=lambda p:sum(v[1] for v in p[1])/len(p[1]),reverse=True):
 pr=[proj(v) for v in pts];outline=hull(pr);s=' '.join(f'{x:.1f},{y:.1f}' for x,y in outline);svg.append(f'<polygon points="{s}" fill="url(#enamel)" fill-opacity=".7" stroke="#5b899c" stroke-width=".7"/>')
 ind=struct.unpack_from('<'+str(part['indexCount'])+'I',b,part['indices'])
 path=[]
 for i in range(0,len(ind),45):
  tri=[pr[ind[i+j]] for j in range(3)];path.append('M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in tri)+'Z')
 svg.append('<path d="'+''.join(path)+'" fill="none" stroke="#397b93" stroke-width=".35" opacity=".3"/>')
 for x,y in pr[::70]:svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r=".8" fill="#2d6980"/>')
svg.append('</g></svg>');pathlib.Path('public/images/treatments/digital-arch.svg').write_text(''.join(svg))
print(mins,maxs)
