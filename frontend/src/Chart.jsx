// Donut chart drawn with pure CSS (conic-gradient). No library needed.
export default function Chart({ jobs, statuses }) {
  const total = jobs.length;

  // build "var(--Applied) 0% 40%, var(--Interview) 40% 60%, ..."
  let start = 0;
  const parts = statuses.map((s) => {
    const percent = (jobs.filter((j) => j.status === s).length / total) * 100;
    const part = `var(--${s}) ${start}% ${start + percent}%`;
    start += percent;
    return part;
  });

  const background = total ? `conic-gradient(${parts.join(", ")})` : "var(--border)";

  return (
    <div className="card chart">
      <div className="donut" style={{ background }}>
        <div className="donut-hole">
          <b>{total}</b>
          <span>total</span>
        </div>
      </div>
      <div className="legend">
        {statuses.map((s) => (
          <p key={s}>
            <span className="dot" style={{ background: `var(--${s})` }}></span>
            {s}: {jobs.filter((j) => j.status === s).length}
          </p>
        ))}
      </div>
    </div>
  );
}
