import { NextRequest, NextResponse } from 'next/server';

const hashString = (value: string) => {
  let hash = 0;

  Array.from(value).forEach((char) => {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  });

  return Math.abs(hash);
};

const mulberry32 = (seed: number) => {
  let t = seed;

  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);

    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export async function GET(request: NextRequest) {
  const seed = request.nextUrl.searchParams.get('seed') || 'guest';
  const hash = hashString(seed);
  const rand = mulberry32(hash);

  const hue = hash % 360;
  const saturation = 85 + (hash % 10);
  const lightness = 60 + (hash % 8);

  const palette = {
    border: '#101c37',
    bg: '#101c37',
    fg: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  };

  const innerSize = 11;
  const offset = 1;
  const outerSize = innerSize + offset * 2;

  const cells: boolean[][] = Array.from({ length: innerSize }, () =>
    Array(innerSize).fill(false),
  );

  // Generate a symmetrical 11x11 grid
  const halfColumns = Math.ceil(innerSize / 2); // 6 for 11x11

  for (let y = 0; y < innerSize; y += 1) {
    for (let x = 0; x < halfColumns; x += 1) {
      const filled = rand() > 0.50;

      cells[y][x] = filled;

      const mirrorX = innerSize - 1 - x;

      if (mirrorX !== x) {
        cells[y][mirrorX] = filled;
      }
    }
  }

  const rects = cells
    .flatMap((row, y) =>
      row.map((filled, x) => {
        if (!filled) return '';

        return `
          <rect
            x="${x + offset}"
            y="${y + offset}"
            width="1"
            height="1"
            fill="${palette.fg}"
          />
        `;
      }),
    )
    .join('');

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${outerSize}"
      height="${outerSize}"
      viewBox="0 0 ${outerSize} ${outerSize}"
      shape-rendering="crispEdges"
    >
      <!-- outer border -->
      <rect width="${outerSize}" height="${outerSize}" fill="${palette.border}" />

      <!-- inner 11x11 background -->
      <rect
        x="${offset}"
        y="${offset}"
        width="${innerSize}"
        height="${innerSize}"
        fill="${palette.bg}"
      />

      ${rects}
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store',
    },
  });
}