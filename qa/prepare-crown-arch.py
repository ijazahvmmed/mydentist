"""Align licensed tooth surfaces before cropping; retain natural crown proportions."""
import json
import math
import pathlib
import struct
import numpy as np

manifest = json.loads(pathlib.Path('assets/models/manifest.json').read_text(encoding='utf-8'))
binary = pathlib.Path('assets/models/dental.bin').read_bytes()
cut_fractions = [.56, .57, .56, .60, .60, .62, .62]
unit = .085
radius = 2.6
depth_radius = 3.8
crowns = {}

for side in (3, 4):
    for order in range(1, 8):
        part = next(p for p in manifest['parts'] if p['id'] == f'tooth-{side}{order}')
        vertices = np.frombuffer(binary, dtype='<f4', count=part['vertexCount'] * 3,
                                 offset=part['positions']).reshape(-1, 3).astype(float)
        faces = np.frombuffer(binary, dtype='<u4', count=part['indexCount'],
                              offset=part['indices']).reshape(-1, 3)
        center = vertices.mean(0)
        _, eigenvectors = np.linalg.eigh(np.cov((vertices - center).T))
        axis = eigenvectors[:, -1]
        if axis[2] < 0:
            axis *= -1
        labial = center - np.array([-246, -235, center[2]])
        labial -= np.dot(labial, axis) * axis
        labial /= np.linalg.norm(labial)
        mesial = np.cross(axis, labial)
        local = (vertices - center) @ np.column_stack([mesial, axis, labial])
        cut = local[:, 1].min() + np.ptp(local[:, 1]) * cut_fractions[order - 1]
        triangles = []
        for face in faces:
            polygon = [local[i] for i in face]
            result = []
            for a, b in zip(polygon, polygon[1:] + polygon[:1]):
                ain, bin = a[1] >= cut, b[1] >= cut
                if ain:
                    result.append(a)
                if ain != bin:
                    intersection = a + (b - a) * (cut - a[1]) / (b[1] - a[1])
                    result.append(intersection)
            for i in range(1, len(result) - 1):
                triangles.append([result[0], result[i], result[i + 1]])
        # Cap the actual boundary connectivity, avoiding seams on concave neck contours.
        points = np.round(np.array(triangles).reshape(-1, 3), 5)
        unique, indices = np.unique(points, axis=0, return_inverse=True)
        edge_uses = {}
        for a, b, c in indices.reshape(-1, 3):
            for edge in ((a, b), (b, c), (c, a)):
                edge_uses.setdefault(tuple(sorted(edge)), []).append(edge)
        border = [uses[0] for uses in edge_uses.values() if len(uses) == 1]
        middle = unique[np.unique(np.array(border).ravel())].mean(0)
        caps = np.array([[middle, unique[b], unique[a]] for a, b in border])
        points = np.concatenate([points, caps.reshape(-1, 3)])
        mn, mx = points.min(0), points.max(0)
        points[:, 0] -= (mn[0] + mx[0]) / 2
        points[:, 1] -= cut
        points[:, 2] -= (mn[2] + mx[2]) / 2
        points *= unit
        crowns[(side, order)] = points


def arrange(upper=False):
    teeth = []
    # The upper row is an authored illustrative adaptation, not scanned maxillary anatomy.
    width_factors = [1.35, 1.12, 1.08, 1.03, 1.03, 1.03, 1.03] if upper else [1] * 7
    widths = [np.mean([np.ptp(crowns[(side, order)][:, 0]) for side in (3, 4)])
              * width_factors[order - 1] for order in range(1, 8)]
    arch_radius = radius * (1.065 if upper else 1)
    arch_depth = depth_radius * (1.065 if upper else 1)
    samples = np.linspace(0, math.pi / 2, 2049)
    speed = np.sqrt((arch_radius * np.cos(samples)) ** 2 + (arch_depth * np.sin(samples)) ** 2)
    lengths = np.concatenate([[0], np.cumsum((speed[:-1] + speed[1:]) / 2 * np.diff(samples))])
    cursor = 0
    angles = []
    for width in widths:
        angles.append(float(np.interp(cursor + width / 2, lengths, samples)))
        cursor += width + .030
    for side in (3, 4):
        for order in range(1, 8):
            p = crowns[(side, order)].copy()
            p[:, 0] *= width_factors[order - 1]
            if upper:
                p[:, 1] *= 1.03
            height = p[:, 1].max()
            # Aligned incisal edges, close bite gap, with each original crown contour retained.
            y = (height - p[:, 1] + .09) if upper else (p[:, 1] - height - .09)
            theta = angles[order - 1] * (1 if side == 3 else -1)
            tangent = math.atan2(arch_depth * math.sin(theta), arch_radius * math.cos(theta))
            x, z = p[:, 0], p[:, 2]
            placed = np.column_stack([
                x * math.cos(tangent) + z * math.sin(tangent) + arch_radius * math.sin(theta),
                y,
                -x * math.sin(tangent) + z * math.cos(tangent) - arch_depth * (1 - math.cos(theta))
                + (.045 if upper else 0),
            ])
            if order == 1:
                placed[:, 0] -= .003 * (1 if side == 3 else -1)
            if upper:
                placed = placed.reshape(-1, 3, 3)[:, [0, 2, 1], :].reshape(-1, 3)
            teeth.append((f'{"upper" if upper else "lower"}-crown-{side}{order}', placed))
    return teeth


def export(path, teeth):
    chunks, views, accessors, meshes, nodes = [], [], [], [], []
    for name, points in teeth:
        unique, idx = np.unique(np.round(points, 5), axis=0, return_inverse=True)
        triangles = idx.reshape(-1, 3)
        # Remove source surface stair-stepping with volume-preserving Taubin smoothing.
        edges = np.concatenate([triangles[:, [0, 1]], triangles[:, [1, 2]], triangles[:, [2, 0]]])
        edges = np.unique(np.sort(edges, axis=1), axis=0)
        src = np.concatenate([edges[:, 0], edges[:, 1]])
        dst = np.concatenate([edges[:, 1], edges[:, 0]])
        degree = np.bincount(src, minlength=len(unique))[:, None]
        for _ in range(8):
            for amount in (.5, -.53):
                average = np.zeros_like(unique)
                np.add.at(average, src, unique[dst])
                average /= np.maximum(degree, 1)
                unique += amount * (average - unique)
        # Finish the clipped neck without flattening the incisal edges or molar cusps.
        extent = np.ptp(unique[:, 1])
        neck_distance = (unique[:, 1].max() - unique[:, 1]) if name.startswith('upper') else (unique[:, 1] - unique[:, 1].min())
        neck_weight = np.clip(1 - neck_distance / (extent * .23), 0, 1)[:, None]
        for _ in range(6):
            for amount in (.5, -.53):
                average = np.zeros_like(unique)
                np.add.at(average, src, unique[dst])
                average /= np.maximum(degree, 1)
                unique += amount * neck_weight * (average - unique)
        # Angle-weighted normals avoid ridged highlights from long clipped triangles.
        normals = np.zeros_like(unique)
        face_points = unique[triangles]
        face_normals = np.cross(face_points[:, 1] - face_points[:, 0], face_points[:, 2] - face_points[:, 0])
        face_normals /= np.maximum(np.linalg.norm(face_normals, axis=1)[:, None], 1e-12)
        for corner in range(3):
            a = face_points[:, (corner + 1) % 3] - face_points[:, corner]
            b = face_points[:, (corner + 2) % 3] - face_points[:, corner]
            cosine = np.sum(a * b, axis=1) / np.maximum(np.linalg.norm(a, axis=1) * np.linalg.norm(b, axis=1), 1e-12)
            angles = np.arccos(np.clip(cosine, -1, 1))
            np.add.at(normals, triangles[:, corner], face_normals * angles[:, None])
        normals /= np.maximum(np.linalg.norm(normals, axis=1)[:, None], 1e-12)
        attrs = {}
        for key, blob, count, typ, component in (
            ('POSITION', unique.astype('<f4').tobytes(), len(unique), 'VEC3', 5126),
            ('NORMAL', normals.astype('<f4').tobytes(), len(normals), 'VEC3', 5126),
            ('index', idx.astype('<u2').tobytes(), len(idx), 'SCALAR', 5123),
        ):
            views.append({'buffer': 0, 'byteOffset': sum(map(len, chunks)), 'byteLength': len(blob)})
            chunks.append(blob + b'\0' * ((-len(blob)) % 4))
            accessor = {'bufferView': len(views) - 1, 'componentType': component,
                        'count': count, 'type': typ}
            if key == 'POSITION':
                accessor.update(min=unique.min(0).tolist(), max=unique.max(0).tolist())
            accessors.append(accessor)
            attrs[key] = len(accessors) - 1
        meshes.append({'name': name, 'primitives': [{'attributes': {'POSITION': attrs['POSITION'], 'NORMAL': attrs['NORMAL']},
                                                    'indices': attrs['index']}]})
        nodes.append({'mesh': len(meshes) - 1, 'name': name})
    blob = b''.join(chunks)
    gltf = {'asset': {'version': '2.0', 'copyright': 'Diaz et al. 2024 CC BY 4.0. Locally aligned crown surfaces; upper row is an editorial adaptation, not patient or diagnostic anatomy.'},
            'scene': 0, 'scenes': [{'nodes': list(range(len(nodes)))}], 'nodes': nodes,
            'meshes': meshes, 'buffers': [{'byteLength': len(blob)}],
            'bufferViews': views, 'accessors': accessors}
    header = json.dumps(gltf).encode()
    header += b' ' * ((-len(header)) % 4)
    out = (struct.pack('<III', 0x46546c67, 2, 28 + len(header) + len(blob))
           + struct.pack('<II', len(header), 0x4e4f534a) + header
           + struct.pack('<II', len(blob), 0x004e4942) + blob)
    pathlib.Path(path).write_bytes(out)
    print(path, len(out), 'bytes;', len(meshes), 'teeth')

export('public/models/dental-crowns.glb', arrange() + arrange(upper=True))
export('public/models/dental-scan-crowns.glb', arrange())
