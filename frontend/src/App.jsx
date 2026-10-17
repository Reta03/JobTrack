
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  async function loadApplications() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/applications`);

      if (!response.ok) {
        throw new Error("Could not load applications.");
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError("Couldn't connect to the backend. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }
 async function handleSubmit(event) {
  event.preventDefault();
  setSaving(true);
  setFormError("");

  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_name: companyName,
        position: position,
        status: status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create application.");
    }

    setCompanyName("");
    setPosition("");
    setStatus("Applied");
    setShowForm(false);

    await loadApplications();
  } catch (err) {
    setFormError(err.message || "Something went wrong.");
  } finally {
    setSaving(false);
  }
}

async function handleDelete(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete application.");
    }

    await loadApplications();
  } catch (err) {
    alert(err.message || "Could not delete application.");
  }
}

async function handleUpdate(event) {
  event.preventDefault();

  const application = applications.find(
    (app) => app.id === editingId
  );

  if (!application) return;

  try {
    const response = await fetch(
      `${API_URL}/applications/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          position: position,
          status: status,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update application.");
    }

    setEditingId(null);
    setCompanyName("");
    setPosition("");
    setStatus("Applied");
    setShowForm(false);

    await loadApplications();
  } catch (err) {
    setFormError(err.message || "Could not update application.");
  }
}

  useEffect(() => {
    loadApplications();
  }, []);

  const interviews = applications.filter(
    (app) => app.status.toLowerCase() === "interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status.toLowerCase() === "offer"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span>J</span> JobTrack</div>
        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ &nbsp; Dashboard</div>
        <div className="nav-item">▤ &nbsp; Applications</div>
        <div className="sidebar-bottom">Your career, organized.</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR CAREER WORKSPACE</p>
            <h1>Dashboard</h1>
          </div>
          <div className="avatar">R</div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow light">KEEP MOVING FORWARD</p>
            <h2>Your next opportunity starts here.</h2>
            <p>Keep track of your applications, interviews, and offers.</p>
          </div>
          <div className="welcome-icon">↗</div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-icon purple">▤</span>
            <p>Total applications</p>
            <strong>{applications.length}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-icon orange">◷</span>
            <p>Interviews</p>
            <strong>{interviews}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>Offers</p>
            <strong>{offers}</strong>
          </article>
        </section>

        <section className="applications-panel">
          <div className="section-heading">
            <div className="section-heading">
  <div>
    <h2>Your applications</h2>
    <p>Keep an eye on your job search progress.</p>
  </div>

  <div className="heading-actions">
    <button
      className="secondary-button"
      onClick={loadApplications}
    >
      ↻ Refresh
    </button>

    <button
      className="primary-button"
      onClick={() => {
        setFormError("");
        setShowForm(!showForm);
      }}
    >
      + Add application
    </button>
  </div>
</div>

{showForm && (
  <form
  className="application-form"
  onSubmit={editingId !== null ? handleUpdate : handleSubmit}
>
    <h3>{editingId !== null ? "Edit application" : "Add a job application"}</h3>

    <label>
      Company name
      <input
        value={companyName}
        onChange={(event) => setCompanyName(event.target.value)}
        placeholder="e.g. Google"
        required
      />
    </label>

    <label>
      Position
      <input
        value={position}
        onChange={(event) => setPosition(event.target.value)}
        placeholder="e.g. Software Engineer Intern"
        required
      />
    </label>

    <label>
      Status
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
    </label>

    {formError && <p className="error">{formError}</p>}

    <button className="primary-button" type="submit" disabled={saving}>
      {saving
  ? "Saving..."
  : editingId !== null
    ? "Update application"
    : "Save application"}
    </button>
  </form>
)}
          </div>

          {loading ? (
            <p className="message">Loading your applications...</p>
          ) : error ? (
            <p className="message error">{error}</p>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No applications yet</h3>
              <p>Your applications will appear here once you add one.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>COMPANY</th>
                    <th>POSITION</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="company-cell">{application.company_name}</td>
                      <td>{application.position}</td>
                      <td>
                        <span
                          className={`status status-${application.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td>
  <button
    className="secondary-button"
    onClick={() => {
      setEditingId(application.id);
      setCompanyName(application.company_name);
      setPosition(application.position);
      setStatus(application.status);
      setFormError("");
      setShowForm(true);
    }}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => handleDelete(application.id)}
  >
    Delete
  </button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>JobTrack · One step closer to your next role.</footer>
      </main>
    </div>
  );
}

export default App;
