import { API } from "../apiClient";

export async function getCandidates({ page, pageSize, search, status }) {
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