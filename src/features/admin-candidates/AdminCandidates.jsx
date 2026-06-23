import { useEffect, useState } from "react";
import "./AdminCandidates.css";
import { getCandidates } from "../../services/candidateService";
import { getUserRoleFromToken } from "../../apiClient";
import useDebounce from '../../hooks/useDebounce';

const pageSize = 5;
const USE_MOCK = true; //flip to false for real backend data

function AdminCandidates() {
  const userRole = getUserRoleFromToken();
  // ADD THESE — open browser console and check
  console.log("USE_MOCK:", USE_MOCK);
  console.log("userRole:", userRole);

  const [candidatesData, setCandidatesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthorizedEmployee =
  userRole === "ROLE_EMPLOYEE" || userRole === "ROLE_ADMIN";
  const isUnauthorized = !isAuthorizedEmployee;
  
  useEffect(() => {
    if (!USE_MOCK && isUnauthorized) return;

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
  if (!USE_MOCK && !userRole) {
    return (
      <div className="forbidden-page">
        <h1>403</h1>
        <p>Please login to access this page.</p>
      </div>
    );
  }

  if (!USE_MOCK && isUnauthorized) {
    return (
      <div className="forbidden-page">
        <h1>403</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }


  const handleViewDetails = (candidate) => {
    alert(
      `Candidate Details\n\nName: ${candidate.fullName}\nEmail: ${candidate.email}\nPhone: ${candidate.phoneNumber}`
    );
  };

  const handleDelete = (candidateId) => {
    const updatedCandidates = candidatesData.filter(
      (candidate) => candidate.id !== candidateId
    );

    setCandidatesData(updatedCandidates);
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
                  <td>{candidate.id || candidate.candidateId}</td>
                  <td>{candidate.name || candidate.fullName}</td>
                  <td>{candidate.email || candidate.emailAddress}</td>
                  <td>{candidate.phone || candidate.phoneNumber}</td>
                  <td>
                    <span className={`status-badge ${candidate.status?.toLowerCase()}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>{candidate.createdDate || candidate.createdAt}</td>
                  <td className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(candidate)}
                    >
                      View Details
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(candidate.id)}
                    >
                      Delete
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