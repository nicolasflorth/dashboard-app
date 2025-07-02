
export interface User {
  _id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  roles: string[];
  image: string;
}

export type MinimalUser = Pick<User, '_id' | 'email' | 'roles'>;

export interface AuthState {
  user: MinimalUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
