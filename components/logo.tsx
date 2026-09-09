export function WorkRRLogo({
  className = "h-24 w-24",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 88 88"
      className={className}
      role="img"
      aria-label="WorkRR"
    >
      <rect width="88" height="88" rx="24" fill="white" fillOpacity="0.96" />
      <text
        x="44"
        y="56"
        textAnchor="middle"
        fill="#1E40AF"
        fontSize="30"
        fontWeight="800"
        fontFamily="var(--font-inter), Inter, system-ui, sans-serif"
        letterSpacing="-1.5"
      >
        RR
      </text>
    </svg>
  );
}
