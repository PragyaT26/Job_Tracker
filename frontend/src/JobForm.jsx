import { useState } from "react";

// Same form is used for adding and editing.
export default function JobForm({ statuses, editing, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: editing?.company || "",
    role: editing?.role || "",
    status: editing?.status || "Applied",
    appliedDate: (editing?.appliedDate || new Date().toISOString()).slice(0, 10),
    link: editing?.link || "",
    notes: editing?.notes || "",
  });

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    const ok = await onSave(form);
    if (ok && !editing) setForm({ ...form, company: "", role: "", link: "", notes: "" });
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>{editing ? "Edit application" : "Add application"}</h3>
      <div className="row">
        <input name="company" placeholder="Company *" value={form.company} onChange={change} required />
        <input name="role" placeholder="Role *" value={form.role} onChange={change} required />
      </div>
      <div className="row">
        <select name="status" value={form.status} onChange={change}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="date" name="appliedDate" value={form.appliedDate} onChange={change} />
      </div>
      <input type="url" name="link" placeholder="Job post link (https://...)" value={form.link} onChange={change} />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={change} />
      <div>
        <button type="submit">{editing ? "Update" : "Add"}</button>
        {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
