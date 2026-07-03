"""
Background stripper: for AI-generated sprite PNGs that came back with a
near-white flat matte instead of true alpha, remove the outer background pixels
by flood-filling from the border and knocking out anything close to that
sampled background color.

Applied to all files in /app/frontend/public/generated/ EXCEPT the bg_*.png
scenes (those are backgrounds and should stay opaque).
"""
from PIL import Image
from pathlib import Path
import sys

SRC = Path("/app/frontend/public/generated")
OUT = SRC  # overwrite in place

# The color-distance threshold for "same as background"
TOL = 40   # 0..~441 (sqrt(3*255^2))

SKIP_PREFIXES = ("bg_",)  # keep the backgrounds opaque


def color_dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def strip_bg(path: Path):
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size

    # Sample bg from 4 corners + midpoints of edges — pick median-ish
    samples = [
        px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1],
        px[w // 2, 0], px[w // 2, h - 1], px[0, h // 2], px[w - 1, h // 2],
    ]
    # Assume background is the most-common corner color
    from collections import Counter
    c = Counter([s[:3] for s in samples])
    bg = c.most_common(1)[0][0]

    # If the sampled bg is dark (e.g. actual dark scene), skip
    lum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
    # Check if the corners are uniform gray (a flat matte); skip only if truly dark AND non-uniform
    max_diff = max(abs(bg[0]-bg[1]), abs(bg[1]-bg[2]), abs(bg[0]-bg[2]))
    if lum < 40 and max_diff > 12:
        print(f"[SKIP-DARK] {path.name} bg={bg} lum={lum:.0f}")
        return

    # Flood-fill from all border pixels, marking connected bg-like pixels
    visited = bytearray(w * h)
    stack = []

    def push(x, y):
        idx = y * w + x
        if visited[idx]:
            return
        p = px[x, y]
        if color_dist(p[:3], bg) <= TOL:
            visited[idx] = 1
            stack.append((x, y))

    for x in range(w):
        push(x, 0); push(x, h - 1)
    for y in range(h):
        push(0, y); push(w - 1, y)

    while stack:
        x, y = stack.pop()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny * w + nx]:
                p = px[nx, ny]
                if color_dist(p[:3], bg) <= TOL:
                    visited[ny * w + nx] = 1
                    stack.append((nx, ny))

    # Set alpha=0 for visited pixels; feather edge (partial alpha for near-bg)
    changed = 0
    for y in range(h):
        for x in range(w):
            idx = y * w + x
            if visited[idx]:
                px[x, y] = (bg[0], bg[1], bg[2], 0)
                changed += 1
            else:
                # if close to bg but not connected, soften alpha
                p = px[x, y]
                d = color_dist(p[:3], bg)
                if d < TOL * 1.4:
                    a = min(255, int(255 * (d / (TOL * 1.4))))
                    px[x, y] = (p[0], p[1], p[2], a)

    img.save(path, optimize=True)
    print(f"[OK]   {path.name} bg={bg} removed={changed}px ({100*changed/(w*h):.1f}%)")


def main():
    for p in sorted(SRC.glob("*.png")):
        if p.name.startswith(SKIP_PREFIXES):
            continue
        try:
            strip_bg(p)
        except Exception as e:
            print(f"[ERR] {p.name}: {e}")


if __name__ == "__main__":
    main()
