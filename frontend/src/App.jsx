import { useState, useEffect } from "react";
import { api } from "./api";
import Login from "./Login.jsx";
import JobForm from "./JobForm.jsx";
import JobList from "./JobList.jsx";
import Chart from "./Chart.jsx";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function App() {
  // logged in if a token is saved in the browser
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(null); // job being edited
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(""); // message shown at the top

  async function loadJobs() {
    try {
      setJobs(await api("/api/jobs"));
    } catch (err) {
      if (err.status === 401) logout(); // token expired or invalid
      else setError(err.message);
    }
  }

  // theme: "light" or "dark", remembered in the browser
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // CSS reads this
    localStorage.setItem("theme", theme);
  }, [theme]);

  const themeButton = (
    <button className="theme-btn secondary" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );

  // load jobs whenever the user logs in
  useEffect(() => {
    if (loggedIn) loadJobs();
  }, [loggedIn]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setJobs([]);
    setLoggedIn(false);
  }

  // Runs an action. If it fails, show the error instead of crashing silently.
  // Returns true on success, false on failure.
  async function run(action) {
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      else setError(err.message);
      return false;
    }
  }

  async function saveJob(job) {
    const ok = await run(async () => {
      if (editing) await api("/api/jobs/" + editing._id, "PUT", job);
      else await api("/api/jobs", "POST", job);
    });
    if (ok) {
      setEditing(null);
      loadJobs();
    }
    return ok;
  }

  async function deleteJob(id) {
    if (!confirm("Delete this application?")) return;
    const ok = await run(() => api("/api/jobs/" + id, "DELETE"));
    if (ok) loadJobs();
  }

  async function changeStatus(job, status) {
    const ok = await run(() => api("/api/jobs/" + job._id, "PUT", { ...job, status }));
    if (ok) loadJobs();
  }

  if (!loggedIn) {
    return (
      <>
        <div className="top-right">{themeButton}</div>
        <Login onLogin={() => setLoggedIn(true)} />
      </>
    );
  }

  // apply filter + search
  const shown = jobs.filter(
    (j) =>
      (filter === "All" || j.status === filter) &&
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>Job Tracker</h1>
        <div>
          <span className="email">{localStorage.getItem("email")}</span>
          {themeButton}
          <button className="secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && (
        <p className="error-box">
          {error} <a href="#" onClick={(e) => { e.preventDefault(); setError(""); }}>Dismiss</a>
        </p>
      )}

      <div className="counts">
        {STATUSES.map((s) => (
          <div key={s} className={"count " + s}>
            <b>{jobs.filter((j) => j.status === s).length}</b> {s}
          </div>
        ))}
      </div>

      <Chart jobs={jobs} statuses={STATUSES} />

      <JobForm
        key={editing ? editing._id : "new"}
        statuses={STATUSES}
        editing={editing}
        onSave={saveJob}
        onCancel={() => setEditing(null)}
      />

      <div className="filters">
        <input
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <JobList
        jobs={shown}
        statuses={STATUSES}
        onEdit={setEditing}
        onDelete={deleteJob}
        onStatus={changeStatus}
      />
    </div>
  );
}
