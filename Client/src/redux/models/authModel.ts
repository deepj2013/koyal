export interface AuthModel {
  adminInfo: AuthInfo | null;
  isAdminLoggedIn: boolean;
  userInfo: UserInfo | null;
  isUserLoggedIn: boolean;
}

export interface AuthInfo {
  token: string;
  expiresAt: number;
  userName: string;
  email: string;
}
export interface UserInfo {
  token: string;
  expiresAt: number;
  name: string;
  email: string;
}
