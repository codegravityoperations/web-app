import "./CandidateLandingPage.css";

/**
 * Candidate landing page shown after a candidate successfully logs in.
 *
 * Available API support:
 * - POST /api/auth/logout
 * - PUT /api/candidates/{id}/profile
 * - Candidate upload endpoints
 *
 * There is currently no GET /api/candidates/me endpoint, so this page
 * displays the candidate information returned by the login response.
 */
export default function CandidateLandingPage({
  auth = {},
  onEditProfile,
}) {
  /**
   * Login currently returns values such as:
   * email, businessId, userType, role, and tokenType.
   *
   * Use the best available value for the candidate's display name.
   */
  const candidateName =
    auth.firstName ||
    auth.fullName ||
    auth.email?.split("@")[0] ||
    "Candidate";

  const candidateEmail = auth.email || "Not available";
  const candidateId = auth.businessId || "Not available";
  const candidateRole = auth.role || "ROLE_CANDIDATE";
  const candidateUserType = auth.userType || "CANDIDATE";
  const tokenType = auth.tokenType || "Bearer";

  /**
   * Open the candidate edit-profile screen.
   */
  const handleEditProfile = () => {
    onEditProfile?.();
  };

  return (
    <div className="candidate-dashboard-page">
      {/* =====================================================
          Header
      ====================================================== */}
      <header className="candidate-dashboard-header">
        <div className="candidate-dashboard-brand">
          <div
            className="candidate-dashboard-logo"
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h2>Code Gravity</h2>
            <p>Candidate Portal</p>
          </div>
        </div>

        <div className="candidate-dashboard-user">
          <div
            className="candidate-dashboard-avatar"
            aria-hidden="true"
          >
            {candidateName.charAt(0).toUpperCase()}
          </div>

          <div className="candidate-dashboard-user-details">
            <strong>{candidateName}</strong>
            <span title={candidateEmail}>{candidateEmail}</span>
          </div>
        </div>
      </header>

      {/* =====================================================
          Main Dashboard Content
      ====================================================== */}
      <main className="candidate-dashboard-content">
        {/* Welcome banner */}
        <section className="candidate-dashboard-welcome">
          <div>
            <span className="candidate-dashboard-label">
              Candidate Dashboard
            </span>

            <h1>Welcome back, {candidateName}!</h1>

            <p>
              Review your account information and keep your candidate profile
              up to date.
            </p>
          </div>
        </section>

        {/* ===================================================
            Account Summary Cards
        ==================================================== */}
        <section
          className="candidate-dashboard-info-grid"
          aria-label="Candidate account summary"
        >
          {/* Account type */}
          <article className="candidate-dashboard-info-card">
            <div
              className="candidate-dashboard-card-icon purple"
              aria-hidden="true"
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span className="candidate-dashboard-card-label">
                Account Type
              </span>

              <strong>{candidateUserType}</strong>

              <p>Your registered portal account type.</p>
            </div>
          </article>

          {/* Email address */}
          <article className="candidate-dashboard-info-card">
            <div
              className="candidate-dashboard-card-icon blue"
              aria-hidden="true"
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 4h16v16H4V4zM4 8l8 5 8-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span className="candidate-dashboard-card-label">
                Email Address
              </span>

              <strong
                className="candidate-dashboard-card-value"
                title={candidateEmail}
              >
                {candidateEmail}
              </strong>

              <p>The email associated with your account.</p>
            </div>
          </article>

          {/* Account status */}
          <article className="candidate-dashboard-info-card">
            <div
              className="candidate-dashboard-card-icon green"
              aria-hidden="true"
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span className="candidate-dashboard-card-label">
                Account Status
              </span>

              <strong className="candidate-dashboard-active">
                Active
              </strong>

              <p>Your candidate account is active.</p>
            </div>
          </article>
        </section>

        {/* ===================================================
            Authenticated Account Information
        ==================================================== */}
        <section className="candidate-dashboard-profile-section">
          <div className="candidate-dashboard-section-heading">
            <div>
              <h2>Your account information</h2>

              <p>
                This information comes from your authenticated login session.
              </p>
            </div>

            <button
              type="button"
              className="candidate-dashboard-secondary-button"
              onClick={handleEditProfile}
            >
              Update Profile
            </button>
          </div>

          <div className="candidate-dashboard-details">
            <div className="candidate-dashboard-detail">
              <span>Email</span>
              <strong title={candidateEmail}>
                {candidateEmail}
              </strong>
            </div>

            <div className="candidate-dashboard-detail">
              <span>Candidate ID</span>
              <strong title={candidateId}>
                {candidateId}
              </strong>
            </div>

            <div className="candidate-dashboard-detail">
              <span>Role</span>
              <strong title={candidateRole}>
                {candidateRole}
              </strong>
            </div>

            <div className="candidate-dashboard-detail">
              <span>Token Type</span>
              <strong>{tokenType}</strong>
            </div>
          </div>
        </section>

        {/* ===================================================
            Quick Actions
        ==================================================== */}
        <section className="candidate-dashboard-actions-section">
          <div className="candidate-dashboard-section-title">
            <h2>Quick actions</h2>
            <p>Manage your candidate portal account.</p>
          </div>

          <div className="candidate-dashboard-actions-grid">
            {/* Update Document — not available yet */}
            <button
              type="button"
              className="candidate-dashboard-action-card disabled"
              disabled
              title="This feature is not available yet"
            >
              <div
                className="candidate-dashboard-action-icon"
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Update Document</h3>
                <p>
                  This feature will be available in a future update.
                </p>
              </div>
            </button>

            {/* Applications endpoint/page is not available yet */}
            <button
              type="button"
              className="candidate-dashboard-action-card disabled"
              disabled
              title="This feature is not available yet"
            >
              <div
                className="candidate-dashboard-action-icon"
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h3>My Applications</h3>
                <p>
                  This feature will be available in a future update.
                </p>
              </div>
            </button>

            {/* Jobs endpoint/page is not available yet */}
            <button
              type="button"
              className="candidate-dashboard-action-card disabled"
              disabled
              title="This feature is not available yet"
            >
              <div
                className="candidate-dashboard-action-icon"
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2M3 9h18M5 6h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Browse Jobs</h3>
                <p>
                  This feature will be available in a future update.
                </p>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}