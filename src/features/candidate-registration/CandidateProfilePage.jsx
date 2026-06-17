import "./CandidateRegistrationForm.css";

// ─── Allowed roles ────────────────────────────────────────────────────────────
const ALLOWED_ROLES = ["ROLE_EMPLOYEE", "ROLE_ADMIN"];

// ─── Mock candidate data (replace with real API call) ─────────────────────────
const MOCK_CANDIDATE = {
  id: "CND-2024-001234",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  status: "Pending",
  submittedAt: "May 20, 2026 at 2:35 PM",
  address: {
    street: "123 Main Street",
    apt: "Apt 4B",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "United States",
  },
  documents: [
    {
      type: "Resume",
      filename: "John_Doe_Resume.pdf",
      uploaded: "May 20, 2026",
      icon: "📄",
      url: "/documents/resume",
    },
    {
      type: "EAD / Work Authorization",
      filename: "EAD_Document.pdf",
      uploaded: "May 20, 2026",
      icon: "🛡️",
      url: "/documents/ead",
    },
    {
      type: "Driver License",
      filename: "CA_Drivers_License.pdf",
      uploaded: "May 20, 2026",
      icon: "💳",
      url: "/documents/license",
    },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BackButton({ onBack }) {
  return (
    <button className="back-link" onClick={onBack} aria-label="Back to candidate list">
      ← Back to Candidate List
    </button>
  );
}

function InfoField({ label, value, icon }) {
  return (
    <div className="info-field">
      <label>
        {icon && <span aria-hidden="true">{icon}</span>}
        {label}
      </label>
      <div className="value">{value || "—"}</div>
    </div>
  );
}

function DocumentItem({ doc }) {
  return (
    <div className="doc-item">
      <div className="doc-header">
        <div className="doc-icon" aria-hidden="true">{doc.icon}</div>
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
          🔗 View
        </a>
        <a
          className="btn-download"
          href={doc.url}
          download={doc.filename}
          aria-label={`Download ${doc.type}`}
        >
          ⬇
        </a>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="candidate-registration-page">
      <div className="access-denied" role="alert">
        <div style={{ fontSize: 40, marginBottom: 16 }} aria-hidden="true">🔒</div>
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
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3>Candidate Not Found</h3>
      <p>
        {message ||
          "The candidate profile could not be loaded. It may have been removed or the ID is invalid."}
      </p>
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────────────
/**
 * CandidateProfilePage
 *
 * Props:
 *   userRole       {string}          – e.g. "ROLE_EMPLOYEE" | "ROLE_ADMIN" | "ROLE_OTHER"
 *   candidate      {object|null}     – candidate data object; null triggers not-found state
 *   apiError       {string|null}     – error message from API; null = no error
 *   onBack         {function}        – called when the back button is clicked
 *   isLoading      {boolean}         – optional loading flag
 */
export default function CandidateProfilePage({
  userRole,
  candidate = MOCK_CANDIDATE, // replace with real prop in production
  apiError = null,
  onBack = () => {},
  isLoading = false,
}) {
  // ── Role guard ──────────────────────────────────────────────────────────────
  if (!ALLOWED_ROLES.includes(userRole)) {
    return <AccessDenied />;
  }

  const c = candidate;

  return (
    <>
      <div className="candidate-registration-page">
        <BackButton onBack={onBack} />

        {/* ── Loading skeleton (optional) ─────────────────────────────────── */}
        {isLoading && (
          <p style={{ color: "#6b7280", fontSize: 15 }}>Loading candidate profile…</p>
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
                    <div className="card-icon" aria-hidden="true">👤</div>
                    Personal Information
                  </div>
                  <div className="info-grid">
                    <InfoField label="First Name" value={c.firstName} />
                    <InfoField label="Last Name"  value={c.lastName}  />
                    <InfoField label="Email"        value={c.email} icon="✉️" />
                    <InfoField label="Phone Number" value={c.phone} icon="📞" />
                  </div>
                </div>

                {/* Address Information */}
                <div className="info-card">
                  <div className="card-title">
                    <div className="card-icon" aria-hidden="true">📍</div>
                    Address Information
                  </div>
                  <div className="info-grid">
                    <InfoField label="Street Address" value={c.address.street} />
                    <InfoField label="Apt / Unit"     value={c.address.apt}    />
                    <InfoField label="City"           value={c.address.city}   />
                    <InfoField label="State"          value={c.address.state}  />
                    <InfoField label="Zip Code"       value={c.address.zip}    />
                    <InfoField label="Country"        value={c.address.country}/>
                  </div>
                </div>
              </div>

              {/* Right: sidebar */}
              <div className="sidebar">
                {/* Documents */}
                <div className="doc-card">
                  <h3>Document Details</h3>
                  {c.documents.map((doc, i) => (
                    <DocumentItem key={i} doc={doc} />
                  ))}
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
    </>
  );
}
