import type { ApiResponse } from 'types/api-response';
import type { CategoryTree } from 'types/category';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const CATEGORY_TREE_API_PATH = '/categories/tree';

export async function getCategoryTree(userId: string): Promise<CategoryTree[]> {
  const response: ApiResponse<CategoryTree[]> = await fetchApi(`${CATEGORY_TREE_API_PATH}?userId=${userId}`);
  
  return unwrapApiResponse<CategoryTree[]>(response);
}

export async function saveCategoryTree(userId: string, categoryTree: CategoryTree[]): Promise<CategoryTree[]> {
  const response: ApiResponse<CategoryTree[]> = await fetchApi(`${CATEGORY_TREE_API_PATH}?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryTree),
  });

  return unwrapApiResponse<CategoryTree[]>(response);
}