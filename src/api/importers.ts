import type { ApiResponse } from 'types/api-response';
import type { Importer } from 'types/importer';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const IMPORTERS_API_PATH = '/importers';

export async function getImporters(): Promise<Importer[]> {
  const response: ApiResponse<Importer[]> = await fetchApi(IMPORTERS_API_PATH);

  return unwrapApiResponse<Importer[]>(response);
}

export async function createImporter(importer: Omit<Importer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Importer> {
  const response: ApiResponse<Importer> = await fetchApi(IMPORTERS_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(importer),
  });

  return unwrapApiResponse<Importer>(response);
}

export async function updateImporter(importer: Partial<Omit<Importer, 'createdAt' | 'updatedAt'>> & { id: string }): Promise<Importer> {
  const response: ApiResponse<Importer> = await fetchApi(`${IMPORTERS_API_PATH}/${importer.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(importer),
  });

  return unwrapApiResponse<Importer>(response);
}

export async function deleteAccount(importerId: string): Promise<Importer> {
  const response: ApiResponse<Importer> = await fetchApi(`${IMPORTERS_API_PATH}/${importerId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return unwrapApiResponse<Importer>(response);
}