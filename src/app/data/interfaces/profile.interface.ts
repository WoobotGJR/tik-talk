export interface Profile {
  id: number;
  username: string;
  avatarUrl: string | null;
  firstname: string;
  lastname: string;
  subscriptionsAmount: number;
  isActive: boolean;
  stack: string[];
  city: string | null;
  description: string;
}
