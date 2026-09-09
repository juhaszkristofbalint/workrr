export function BarChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; color: string; values: number[] }[];
}) {
  const width = 560;
  const height = 220;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(...series.flatMap((item) => item.values), 1);
  const groupW = innerW / labels.length;
  const barW = Math.min(18, (groupW - 8) / series.length);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img">
      {labels.map((label, index) => {
        const x = pad.l + index * groupW;
        return (
          <g key={label}>
            {series.map((item, seriesIndex) => {
              const h = (item.values[index] / max) * innerH;
              return (
                <rect
                  key={item.name}
                  x={x + 8 + seriesIndex * (barW + 4)}
                  y={pad.t + innerH - h}
                  width={barW}
                  height={h}
                  rx={4}
                  fill={item.color}
                />
              );
            })}
            <text
              x={x + groupW / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted"
              fontSize="11"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; color: string; values: number[] }[];
}) {
  const width = 560;
  const height = 220;
  const pad = { l: 40, r: 12, t: 16, b: 28 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(...series.flatMap((item) => item.values), 1);

  function points(values: number[]) {
    return values
      .map((value, index) => {
        const x = pad.l + (index / Math.max(values.length - 1, 1)) * innerW;
        const y = pad.t + innerH - (value / max) * innerH;
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img">
      {series.map((item) => (
        <polyline
          key={item.name}
          fill="none"
          stroke={item.color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points(item.values)}
        />
      ))}
      {labels.map((label, index) => {
        const x = pad.l + (index / Math.max(labels.length - 1, 1)) * innerW;
        return (
          <text
            key={label}
            x={x}
            y={height - 8}
            textAnchor="middle"
            className="fill-muted"
            fontSize="11"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function ChartLegend({
  items,
}: {
  items: { name: string; color: string }[];
}) {
  return (
    <ul className="flex flex-wrap gap-4 text-caption text-muted">
      {items.map((item) => (
        <li key={item.name} className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: item.color }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
}
