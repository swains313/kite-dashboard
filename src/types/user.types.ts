export interface ManagedUser {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}
