"""Audit crown topology and approximate neighboring contact with cross-section samples.

Uses the same NumPy dependency as prepare-crown-arch.py. Topology counts are exact.
The overlap result samples ray intersections; it is a diagnostic, not an exhaustive
triangle intersection proof or a clinical bite assessment.
"""
import argparse
import json
import pathlib
import struct

import numpy as np


def read_meshes(path):
    raw = path.read_bytes()
    json_length = struct.unpack_from('<I', raw, 12)[0]
    gltf = json.loads(raw[20:20 + json_length])
    payload = raw[28 + json_length:]

    def accessor(index, dtype, columns):
        item = gltf['accessors'][index]
        view = gltf['bufferViews'][item['bufferView']]
        components = 3 if item['type'] == 'VEC3' else 1
        offset = view.get('byteOffset', 0) + item.get('byteOffset', 0)
        return np.frombuffer(payload, dtype=dtype, count=item['count'] * components,
                             offset=offset).reshape(-1, columns)

    result = {}
    for mesh in gltf['meshes']:
        primitive = mesh['primitives'][0]
        vertices = accessor(primitive['attributes']['POSITION'], '<f4', 3).astype(float)
        faces = accessor(primitive['indices'], '<u2', 3)
        result[mesh['name']] = vertices, faces
    return result


def topology(mesh):
    _, faces = mesh
    edges = np.sort(np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]],
                                    faces[:, [2, 0]]]), axis=1)
    _, counts = np.unique(edges, axis=0, return_counts=True)
    return {'open_edges': int(np.sum(counts == 1)),
            'nonmanifold_edges': int(np.sum(counts > 2))}


def ray_sections(mesh, grid):
    vertices, faces = mesh
    triangles = vertices[faces]
    origins = triangles[:, 0, 1:]
    edge_a = triangles[:, 1, 1:] - origins
    edge_b = triangles[:, 2, 1:] - origins
    determinant = edge_a[:, 0] * edge_b[:, 1] - edge_a[:, 1] * edge_b[:, 0]
    usable = np.abs(determinant) > 1e-10
    triangles, origins = triangles[usable], origins[usable]
    edge_a, edge_b, determinant = edge_a[usable], edge_b[usable], determinant[usable]
    sections = []
    for point in grid:
        relative = point - origins
        u = (relative[:, 0] * edge_b[:, 1] - relative[:, 1] * edge_b[:, 0]) / determinant
        v = (edge_a[:, 0] * relative[:, 1] - edge_a[:, 1] * relative[:, 0]) / determinant
        inside = (u >= 0) & (v >= 0) & (u + v <= 1)
        x = (triangles[:, 0, 0] + u * (triangles[:, 1, 0] - triangles[:, 0, 0])
             + v * (triangles[:, 2, 0] - triangles[:, 0, 0]))[inside]
        # Deduplicate hits on shared triangle edges, then pair entry/exit surfaces.
        hits = np.unique(np.round(x, 7))
        sections.append(list(zip(hits[::2], hits[1::2])))
    return sections


def sampled_overlap(left, right, samples):
    a, _ = left
    b, _ = right
    low = np.maximum(a[:, 1:].min(0), b[:, 1:].min(0))
    high = np.minimum(a[:, 1:].max(0), b[:, 1:].max(0))
    if np.any(low >= high):
        return 0.0
    # Interior samples avoid rays lying exactly along a cut boundary.
    axes = [np.linspace(low[i], high[i], samples + 2)[1:-1] for i in range(2)]
    grid = np.stack(np.meshgrid(*axes), axis=-1).reshape(-1, 2)
    maximum = 0.0
    for intervals_a, intervals_b in zip(ray_sections(left, grid), ray_sections(right, grid)):
        for start_a, end_a in intervals_a:
            for start_b, end_b in intervals_b:
                maximum = max(maximum, min(end_a, end_b) - max(start_a, start_b))
    return round(float(maximum), 7)


def audit(path, samples):
    meshes = read_meshes(path)
    exact = {name: topology(mesh) for name, mesh in meshes.items()}
    contacts = {}
    for row in ('lower', 'upper'):
        sequence = ([f'{row}-crown-3{i}' for i in range(7, 0, -1)]
                    + [f'{row}-crown-4{i}' for i in range(1, 8)])
        if not all(name in meshes for name in sequence):
            continue
        for left, right in zip(sequence, sequence[1:]):
            contacts[f'{left} / {right}'] = sampled_overlap(meshes[left], meshes[right], samples)
    return {
        'file': str(path), 'mesh_count': len(meshes),
        'open_edges': sum(item['open_edges'] for item in exact.values()),
        'nonmanifold_edges': sum(item['nonmanifold_edges'] for item in exact.values()),
        'samples_per_axis': samples,
        'sampled_neighbor_pairs': len(contacts),
        'max_sampled_overlap_world_units': max(contacts.values(), default=0),
        'positive_sampled_contacts': {pair: depth for pair, depth in contacts.items() if depth > 0},
        'note': 'Overlap is approximate sampled contact; topology counts are exact.',
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--samples', type=int, default=32)
    parser.add_argument('--output', type=pathlib.Path)
    args = parser.parse_args()
    root = pathlib.Path(__file__).resolve().parents[1]
    results = [audit(root / 'public' / 'models' / name, args.samples)
               for name in ('dental-crowns.glb', 'dental-scan-crowns.glb')]
    report = json.dumps(results, indent=2)
    print(report)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(report + '\n', encoding='utf-8')
    assert all(item['open_edges'] == 0 and item['nonmanifold_edges'] == 0 for item in results), \
        'Crown meshes must be closed and manifold.'
