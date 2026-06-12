import { useEffect, useState } from "react";
import "./AdminCandidates.css";
import { getCandidates } from "../../services/candidateService";
import { getUserRoleFromToken } from "../../apiClient";

const pageSize = 5;

function AdminCandidates() {
  const userRole = getUserRoleFromToken();

  const [candidatesData, setCandidatesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthorizedEmployee =
  userRole === "ROLE_EMPLOYEE" || userRole === "ROLE_ADMIN";
  const isUnauthorized = !isAuthorizedEmployee;
  
  useEffect(() => {
    if (isUnauthorized) return;

    let isMounted = true;

    const loadCandidates = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCandidates({
          page: currentPage,
          pageSize,
          search: searchTerm,
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
  }, [currentPage, searchTerm, statusFilter, isUnauthorized]);

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
        <input
          type="text"
          placeholder="Search by ID, name, email or phone"
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading && <p>Loading candidates...</p>}

      {error && <p className="error-text">{error}</p>}

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
            {!loading && candidatesData.length === 0 ? (
              <tr>
                <td colSpan="7">No candidates found.</td>
              </tr>
            ) : (
              candidatesData.map((candidate) => (
                <tr key={candidate.id || candidate.candidateId}>
                  <td>{candidate.id || candidate.candidateId}</td>
                  <td>{candidate.name || candidate.fullName}</td>
                  <td>{candidate.email || candidate.emailAddress}</td>
                  <td>{candidate.phone || candidate.phoneNumber}</td>
                  <td>
                    <span
                      className={`status-badge ${candidate.status?.toLowerCase()}`}
                    >
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