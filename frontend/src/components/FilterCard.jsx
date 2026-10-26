export default function FilterCard({
  area,
  tone,
  Icon,
  label,
  count,
  hint,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`fcard fcard-${tone} area-${area}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className="fcard-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={2.4} />
      </span>
      <span className="fcard-count">{count}</span>
      <span className="fcard-label">{label}</span>
      <span className="fcard-hint">{hint}</span>
    </button>
  );
}
