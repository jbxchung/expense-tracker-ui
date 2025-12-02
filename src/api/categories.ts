import type { ApiResponse } from 'types/api-response';
import type { Category } from 'types/category';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const CATEGORIES_API_PATH = '/categories'
export const CATEGORY_TREE_API_PATH = `${CATEGORIES_API_PATH}/tree`;

export async function getCategoryTree(userId: string): Promise<Category[]> {
  const response: ApiResponse<Category[]> = await fetchApi(`${CATEGORY_TREE_API_PATH}?userId=${userId}`);
  
  return unwrapApiResponse<Category[]>(response);
}

export async function saveCategoryTree(userId: string, categoryTree: Category[]): Promise<Category[]> {
  const response: ApiResponse<Category[]> = await fetchApi(`${CATEGORY_TREE_API_PATH}?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryTree),
  });

  return unwrapApiResponse<Category[]>(response);
}

export async function createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  const response: ApiResponse<Category> = await fetchApi(CATEGORIES_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category),
  });

  return unwrapApiResponse<Category>(response);
}

export async function updateCategory(category: Partial<Omit<Category, 'createdAt' | 'updatedAt'>> & { id: string }): Promise<Category> {
  const response: ApiResponse<Category> = await fetchApi(`${CATEGORIES_API_PATH}/${category.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category),
  });

  return unwrapApiResponse<Category>(response);
}

export async function deleteCategory(categoryId: string): Promise<Category> {
  const response: ApiResponse<Category> = await fetchApi(`${CATEGORIES_API_PATH}/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return unwrapApiResponse<Category>(response);
}
