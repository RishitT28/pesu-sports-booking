import { useMemo } from "react";

// Deterministic pseudo-QR pattern derived from a seed string
export function QrPass({ seed, size = 180 }: { seed: string; size?: number }) {
  const cells = 21;
  const grid = useMemo(() => {
    let h = 7;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 1000003;
    const g: boolean[][] = [];
    for (let y = 0; y < cells; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < cells; x++) {
        h = (h * 1103515245 + 12345 + x * 7 + y * 13) % 2147483647;
        row.push(h % 3 === 0);
      }
      g.push(row);
    }
    // finder squares
    const finder = (fx: number, fy: number) => {
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 7; x++) {
          const edge = x === 0 || x === 6 || y === 0 || y === 6;
          const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          g[fy + y]![fx + x] = edge || core;
        }
    };
    finder(0, 0);
    finder(cells - 7, 0);
    finder(0, cells - 7);
    return g;
  }, [seed]);

  const cell = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl bg-white p-0">
      <rect width={size} height={size} fill="white" rx={12} />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell + 0.4}
              height={cell + 0.4}
              fill="#0b1220"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
