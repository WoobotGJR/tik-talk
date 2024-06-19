export interface Profile {
  id: number;
  username: string;
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  subscriptionsAmount: number;
  isActive: boolean;
  stack: string[];
  city: string | null;
  description: string;
}
