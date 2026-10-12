const FOLLOW_UP_DAYS = 7; // remind after this many days with no reply

function daysSince(date) {
  return Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
}

export default function JobList({ jobs, statuses, onEdit, onDelete, onStatus }) {
  if (jobs.length === 0) return <p className="muted center">No applications yet.</p>;

  return (
    <div className="list">
      {jobs.map((job) => {
        const days = daysSince(job.appliedDate);
        const needsFollowUp = job.status === "Applied" && days >= FOLLOW_UP_DAYS;
        return (
        <div className="card job" key={job._id}>
          <div>
            <h3>{job.role}</h3>
            <p>{job.company} · {new Date(job.appliedDate).toLocaleDateString()}</p>
            {needsFollowUp && <p className="followup">⏰ Follow up! Applied {days} days ago, no reply yet</p>}
            {job.notes && <p className="muted">{job.notes}</p>}
            {/^https?:\/\//i.test(job.link) && <a href={job.link} target="_blank" rel="noreferrer">View job post</a>}
          </div>
          <div className="actions">
            <select
              className={"badge " + job.status}
              value={job.status}
              onChange={(e) => onStatus(job, e.target.value)}
            >
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="secondary" onClick={() => onEdit(job)}>Edit</button>
            <button className="danger" onClick={() => onDelete(job._id)}>Delete</button>
          </div>
        </div>
        );
      })}
    </div>
  );
}
