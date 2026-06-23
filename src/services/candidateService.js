import { API } from "../apiClient";

  // Mock Data for testing purpose
    const USE_MOCK = true; // ← flip to false when testing against real backend

  const MOCK_CANDIDATES = [
    { id: "C001", name: "Alice Johnson",  email: "alice@email.com",  phone: "1234567890", status: "REGISTERED", createdDate: "2024-01-10" },
    { id: "C002", name: "Bob Smith",      email: "bob@email.com",    phone: "1234567891", status: "SUBMITTED",  createdDate: "2024-01-11" },
    { id: "C003", name: "Carol White",    email: "carol@email.com",  phone: "1234567892", status: "UPDATED",    createdDate: "2024-01-12" },
    { id: "C004", name: "David Brown",    email: "david@email.com",  phone: "1234567893", status: "DELETED",    createdDate: "2024-01-13" },
    { id: "C005", name: "Eva Green",      email: "eva@email.com",    phone: "1234567894", status: "REGISTERED", createdDate: "2024-01-14" },
    { id: "C006", name: "Frank Miller",   email: "frank@email.com",  phone: "1234567895", status: "SUBMITTED",  createdDate: "2024-01-15" },
    { id: "C007", name: "Grace Lee",      email: "grace@email.com",  phone: "1234567896", status: "UPDATED",    createdDate: "2024-01-16" },
    { id: "C008", name: "Henry Wilson",   email: "henry@email.com",  phone: "1234567897", status: "DELETED",    createdDate: "2024-01-17" },
  ];

  const applyMockFilters = ({ page, pageSize, search, status }) => {
    let results = [...MOCK_CANDIDATES];

    // Apply status filter
    if (status) {
      results = results.filter((c) => c.status === status);
    }

    // Apply search filter
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    // Apply pagination
    const totalElements = results.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const start = (page - 1) * pageSize;
    const content = results.slice(start, start + pageSize);

    return {
      data: {
        content,
        totalPages,
        totalElements,
      },
    };
  };

export const getCandidates = async ({ page, pageSize, search, status }) => {
    // ── MOCK MODE ──
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 500)); // simulate network delay
      return applyMockFilters({ page, pageSize, search, status });
    }
  

// ── REAL API ──
  const params = new URLSearchParams();

  params.append("page", page - 1);
  params.append("pageSize", pageSize);

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(`${API.candidates}?${params.toString()}`, {
    method: "GET",
    auth: true,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch candidates");
  }

  return response.json();
}