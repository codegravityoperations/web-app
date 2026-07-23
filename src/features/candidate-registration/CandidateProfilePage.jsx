import "./CandidateProfilePage.css";

// ─── Allowed roles ────────────────────────────────────────────────────────────
const ALLOWED_ROLES = ["ROLE_EMPLOYEE", "ROLE_ADMIN"];

// ─── Normalize the candidate row coming from the list page ────────────────────
// The candidates list (GET /api/candidates) only returns flat fields:
// id, name, email, phone, status, createdDate. There is no
// GET /api/candidates/{id}, so address and documents are not available yet.
function normalizeCandidate(raw) {
  if (!raw) return null;

  const fullName = raw.name || raw.fullName || "";
  const [firstNameGuess, ...rest] = fullName.split(" ");

  return {
    id: raw.id || raw.candidateId || "-",
    firstName: raw.firstName || firstNameGuess || "-",
    lastName: raw.lastName || rest.join(" ") || "",
    email: raw.email || raw.emailAddress || "-",
    phone: raw.phone || raw.phoneNumber || "-",
    status: raw.status || "-",
    submittedAt: raw.submittedAt || raw.createdDate || raw.createdAt || "-",
    address: raw.address || null,
    documents: raw.documents || [],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BackButton({ onBack }) {
  return (
    <button className="back-link" onClick={onBack} aria-label="Back to candidate list">
      Back to Candidate List
    </button>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <label>{label}</label>
      <div className="value">{value || "-"}</div>
    </div>
  );
}

function DocumentItem({ doc }) {
  return (
    <div className="doc-item">
      <div className="doc-header">
        <div className="doc-info">
          <div className="doc-name">{doc.type}</div>
          <div className="doc-file">{doc.filename}</div>
          <div className="doc-date">Uploaded: {doc.uploaded}</div>
        </div>
      </div>
      <div className="doc-actions">
        <a
          className="btn-view"
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${doc.type}`}
        >
          View
        </a>
        <a
          className="btn-download"
          href={doc.url}
          download={doc.filename}
          aria-label={`Download ${doc.type}`}
        >
          Download
        </a>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="candidate-registration-page">
      <div className="access-denied" role="alert">
        <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#111827" }}>Access Denied</h3>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
          You don't have permission to view this page. Please contact your system administrator.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="error-state" role="alert">
      <h3>Candidate Not Found</h3>
      <p>
        {message ||
          "The candidate profile could not be loaded. It may have been removed, the ID is invalid, or you navigated here directly without selecting a candidate from the list."}
      </p>
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────────────
/**
 * CandidateProfilePage
 *
 * Props:
 *   userRole       {string}          - e.g. "ROLE_EMPLOYEE" | "ROLE_ADMIN" | "ROLE_OTHER"
 *   candidate      {object|null}     - raw candidate row passed via router state
 *                                       from AdminCandidates.jsx. null triggers
 *                                       not-found state (e.g. direct URL visit).
 *   apiError       {string|null}     - error message from API; null = no error
 *   onBack         {function}        - called when the back button is clicked
 *   isLoading      {boolean}         - optional loading flag
 */
export default function CandidateProfilePage({
  userRole,
  candidate = null,
  apiError = null,
  onBack = () => {},
  isLoading = false,
}) {
  // ── Role guard ──────────────────────────────────────────────────────────────
  if (!ALLOWED_ROLES.includes(userRole)) {
    return <AccessDenied />;
  }

  const c = normalizeCandidate(candidate);

  return (
    <div className="candidate-registration-page">
      <BackButton onBack={onBack} />

      {/* ── Loading skeleton (optional) ─────────────────────────────────── */}
      {isLoading && (
        <p style={{ color: "#6b7280", fontSize: 15 }}>Loading candidate profile...</p>
      )}

      {/* ── API error / not found ────────────────────────────────────────── */}
      {!isLoading && (apiError || !c) && (
        <ErrorState message={apiError} />
      )}

      {/* ── Profile content ─────────────────────────────────────────────── */}
      {!isLoading && !apiError && c && (
        <>
          {/* Hero */}
          <div className="candidate-hero">
            <h1 className="candidate-hero-name">
              {c.firstName} {c.lastName}
              <span className="status-badge">{c.status}</span>
            </h1>
            <div className="candidate-meta">
              <div>Candidate ID: <strong>{c.id}</strong></div>
              <div>Submitted on {c.submittedAt}</div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="profile-layout">
            {/* Left: info cards */}
            <div className="info-cards">
              {/* Personal Information */}
              <div className="info-card">
                <div className="card-title">
                  Personal Information
                </div>
                <div className="info-grid">
                  <InfoField label="First Name" value={c.firstName} />
                  <InfoField label="Last Name" value={c.lastName} />
                  <InfoField label="Email" value={c.email} />
                  <InfoField label="Phone Number" value={c.phone} />
                </div>
              </div>

              {/* Address Information */}
              <div className="info-card">
                <div className="card-title">
                  Address Information
                </div>
                {c.address ? (
                  <div className="info-grid">
                    <InfoField label="Street Address" value={c.address.street} />
                    <InfoField label="Apt / Unit" value={c.address.apt} />
                    <InfoField label="City" value={c.address.city} />
                    <InfoField label="State" value={c.address.state} />
                    <InfoField label="Zip Code" value={c.address.zip} />
                    <InfoField label="Country" value={c.address.country} />
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    Address information is not available yet.
                  </p>
                )}
              </div>
            </div>

            {/* Right: sidebar */}
            <div className="sidebar">
              {/* Documents */}
              <div className="doc-card">
                <h3>Document Details</h3>
                {c.documents.length > 0 ? (
                  c.documents.map((doc, i) => (
                    <DocumentItem key={i} doc={doc} />
                  ))
                ) : (
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    No documents available yet.
                  </p>
                )}
              </div>

              {/* Read-only note */}
              <div className="note-card" role="note">
                <strong>Note:</strong> This is a read-only view. To make changes to
                candidate data, please contact your system administrator.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
