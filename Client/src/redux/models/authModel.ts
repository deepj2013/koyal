export interface AuthModel {
  adminInfo: AuthInfo | null;
  isAdminLoggedIn: boolean;
}

export interface AuthInfo {
  token: string;
  expiresAt: number;
  userName: string;
  email: string;
}
