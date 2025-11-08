import type { ApiResponse } from "types/api-response";
import { API_BASE_URL } from "./hostUtils";

// generic fetch wrapper
export async function fetchApi<T>(urlPath: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const rawRes = await fetch(`${API_BASE_URL}${urlPath}`, options);
  if (!rawRes.ok) {
    throw new Error(`Network error: ${rawRes.status}`);
  }

  return await rawRes.json();
}

export async function unwrapApiResponse<T>(response: ApiResponse<T>): Promise<T> {
  if (!response.success) {
    throw new Error(response.message || 'API error');
  }
  return response.data as T;
}