// todo - move to common package and share with backend?
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}