import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCandidates.css";
import { getCandidates, deleteCandidate } from "../../services/candidateService";
import { getUserRoleFromToken } from "../../apiClient";
import useDebounce from '../../hooks/useDebounce';

const pageSize = 5;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}, ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

function AdminCandidates() {
  const navigate = useNavigate();
  const userRole = getUserRoleFromToken();

  const [candidatesData, setCandidatesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const isAuthorizedEmployee =
  userRole === "ROLE_EMPLOYEE" || userRole === "ROLE_ADMIN";
  const isUnauthorized = !isAuthorizedEmployee;
  
  useEffect(() => {
    if (isUnauthorized) return;

    let isMounted = true;

    const loadCandidates = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCandidates({
          page: currentPage,
          pageSize,
          search: debouncedSearch,
          status: statusFilter,
        });

        const candidatePage = data.data || data;

        if (!isMounted) return;

        if (Array.isArray(candidatePage)) {
          setCandidatesData(candidatePage);
          setTotalPages(1);
        } else {
          setCandidatesData(candidatePage.content || candidatePage.candidates || []);
          setTotalPages(candidatePage.totalPages || 1);
        }
      } catch {
        if (!isMounted) return;

        setError("Failed to load candidates.");
        setCandidatesData([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCandidates();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, statusFilter, isUnauthorized]);

// ── Auth Guards ──
  if (!userRole) {
    return (
      <div className="forbidden-page">
        <h1>403</h1>
        <p>Please login to access this page.</p>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="forbidden-page">
        <h1>403</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }


  const handleViewDetails = (candidate) => {
    navigate(`/admin/candidates/${candidate.id || candidate.candidateId}`, {
      state: { candidate },
    });
  };

  const handleDelete = async (candidateId) => {
    if (deletingId) return;

    const confirmed = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmed) return;

    setDeletingId(candidateId);
    setDeleteError(null);

    try {
      await deleteCandidate(candidateId);

      setCandidatesData((prev) =>
        prev.map((candidate) =>
          (candidate.id || candidate.candidateId) === candidateId
            ? { ...candidate, status: "DELETED" }
            : candidate
        )
      );
    } catch {
      setDeleteError("Failed to delete candidate. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="admin-candidates-page">
      <div className="admin-candidates-header">
        <div>
          <h1>Candidate List</h1>
          <p>View and manage submitted candidate records.</p>
        </div>
      </div>

      {deleteError && (
        <div className="delete-error-banner">
          <p>{deleteError}</p>
        </div>
      )}

      <div className="candidate-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by ID, name, email or phone"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="status-filter"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="">All Status</option>
          <option value="REGISTERED">Registered</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UPDATED">Updated</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      <div className="candidate-table-container">
        <table className="candidate-table">
          <colgroup>
            <col style={{ width: "170px" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "190px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "195px" }} />
            <col style={{ width: "240px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              // AC 7 — Loading state inside table
              <tr>
                <td colSpan="7" className="table-status-cell">
                  <div className="loading-spinner" />
                  <p>Loading candidates...</p>
                </td>
              </tr>

            ) : error ? (
              // Error state inside table
              <tr>
                <td colSpan="7" className="table-status-cell error-state">
                  <p>{error}</p>
                </td>
              </tr>

            ) : candidatesData.length === 0 ? (
              // AC 8 — Empty state: 4 scenarios
              <tr>
                <td colSpan="7" className="table-status-cell empty-state">
                  {debouncedSearch && statusFilter ? (
                    // Both search + filter active
                    <>
                      <p>
                        No candidates found for <strong>"{debouncedSearch}"</strong> with
                        status <strong>{statusFilter}</strong>.
                      </p>
                      <button
                        className="clear-filter-btn"
                        onClick={() => {
                          handleClearSearch();
                          setStatusFilter("");
                        }}
                      >
                        Clear All Filters
                      </button>
                    </>
                  ) : debouncedSearch ? (
                    // Only search active
                    <>
                      <p>No candidates found for <strong>"{debouncedSearch}"</strong>.</p>
                      <button className="clear-filter-btn" onClick={handleClearSearch}>
                        Clear Search
                      </button>
                    </>
                  ) : statusFilter ? (
                    // Only status filter active
                    <>
                      <p>No candidates with status <strong>{statusFilter}</strong>.</p>
                      <button
                        className="clear-filter-btn"
                        onClick={() => setStatusFilter("")}
                      >
                        Clear Filter
                      </button>
                    </>
                  ) : (
                    // No filters, genuinely empty
                    <p>No candidates found.</p>
                  )}
                </td>
              </tr>

            ) : (
              // Data rows — unchanged
              candidatesData.map((candidate) => (
                <tr key={candidate.id || candidate.candidateId}>
                  <td title={candidate.id || candidate.candidateId}>{candidate.id || candidate.candidateId}</td>
                  <td title={candidate.name || candidate.fullName}>{candidate.name || candidate.fullName}</td>
                  <td title={candidate.email || candidate.emailAddress}>{candidate.email || candidate.emailAddress}</td>
                  <td>{candidate.phone || candidate.phoneNumber}</td>
                  <td>
                    <span className={`status-badge ${candidate.status?.toLowerCase()}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>{formatDate(candidate.createdDate || candidate.createdAt)}</td>
                  <td className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(candidate)}
                    >
                      View Details
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(candidate.id || candidate.candidateId)}
                      disabled={deletingId === (candidate.id || candidate.candidateId)}
                    >
                      {deletingId === (candidate.id || candidate.candidateId) ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminCandidates;