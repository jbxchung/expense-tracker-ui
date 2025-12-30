export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserSignupDto extends UserLoginDto {
  name: string;
}

export const UserRoles = {
  OWNER: 'OWNER',
  USER: 'USER',
} as const;
export type UserRoleKey = keyof typeof UserRoles;
export type UserRole = typeof UserRoles[UserRoleKey];
