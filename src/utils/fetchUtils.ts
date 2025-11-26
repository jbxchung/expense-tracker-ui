import type { ApiResponse } from "types/api-response";
import { API_BASE_URL } from "./hostUtils";

// generic fetch wrapper
export async function fetchApi<T>(urlPath: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const rawRes = await fetch(`${API_BASE_URL}${urlPath}`, options);
  let json: ApiResponse<T> | null = null;
  try {
    json = await rawRes.json();
  } catch (e) {
    throw new Error(`Failed to parse JSON response: ${(e as Error).message}`);
  }

  if (!rawRes.ok) {
    const errorMessage = json?.message ?? `Network error: ${rawRes.status}`;
    throw new Error(errorMessage);
  }

  if (!json) {
    throw new Error('Invalid JSON response from server');
  }

  return json;
}

export async function unwrapApiResponse<T>(response: ApiResponse<T>, transform?: (data: T) => T): Promise<T> {
  if (!response.success) {
    throw new Error(response.message || 'API error');
  }
  const data = response.data as T;

  return transform ? transform(data) : data;
}