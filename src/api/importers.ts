import type { ApiResponse } from 'types/api-response';
import type { Importer } from 'types/importer';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const IMPORTERS_API_PATH = '/importers';

const EXAMPLE_CSV_IMPORTER: Importer = {
  id: 'frontent-test-id',
  name: 'Bank A CSV Importer',
  description: 'Parses exported CSV transaction list from Bank A',
  type: 'csv',
  mapping: {
    amount: {
      title: 'Amount',
      operations: [
        { op: "ifNotNull", sourceField: "Credit", return: "Credit" },
        { op: "ifNotNull", sourceField: "Debit", transform: "negate", return: "Debit" },
        { op: "fallback", value: 0 }
      ],
    },
    date: {
      title: 'Date',
      operations: [
        { op: "dateParse", sourceField: "Date", format: "MM/DD/YYYY" },
        { op: "fallback", value: new Date() }
      ],
    },
    category: {
      title: 'Category',
      operations: [
        { op: "fallback", value: "Uncategorized" }
      ]
    },
    description: {
      title: 'Description',
      operations: [
        { op: "fallback", value: "" }
      ],
    },
    originalDescription: {
      title: 'Original Description',
      operations: [
        { op: "ifNotNull", sourceField: "Description", return: "Description" },
        { op: "fallback", value: "" }
      ],
    },
  }
};

export async function getImporters(): Promise<Importer[]> {
  console.log('DEBUG - getImporters called - returning example for testing');
  return [EXAMPLE_CSV_IMPORTER];
  // const response: ApiResponse<Importer[]> = await fetchApi(IMPORTERS_API_PATH);

  // return unwrapApiResponse<Importer[]>(response);
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
    body: JSON.stringify({importer}),
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