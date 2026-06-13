import { UserRole } from '../types';

export function roleRequiresGymId(role: UserRole): boolean {
  return role !== 'super_admin';
}

export function canAccessGymData(role: UserRole, userGymId: string | null, targetGymId: string): boolean {
  if (role === 'super_admin') return true;
  return userGymId === targetGymId;
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    owner: 'Gym Owner',
    trainer: 'Trainer',
    member: 'Member',
  };
  return labels[role];
}

export function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'AdminTabs';
    case 'owner':
      return 'OwnerTabs';
    case 'trainer':
      return 'TrainerTabs';
    case 'member':
      return 'MemberTabs';
    default:
      return 'Auth';
  }
}
