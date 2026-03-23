import type {
  APIResponse,
  Language,
  SubmissionCreate,
  SubmissionResponse,
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody.detail) {
        message = errorBody.detail;
      }
    } catch {
      // ignore json parse failure
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function getLanguages() {
  return request<APIResponse<Language[]>>("/languages");
}

export function createSubmission(payload: SubmissionCreate) {
  return request<APIResponse<SubmissionResponse>>("/submissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getSubmission(token: string) {
  return request<APIResponse<SubmissionResponse>>(`/submissions/${token}`);
}

export { API_BASE_URL };
