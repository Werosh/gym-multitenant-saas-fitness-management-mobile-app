export {
  mockGetMembershipsByGym as getMembershipsByGym,
  mockGetMembershipByMember as getMembershipByMember,
  getMembershipStatus,
} from '../data/mockApi';

export { calculateExpiryDate } from '../data/mockData';

export async function createMembership(
  gymId: string,
  memberId: string,
  plan: import('../types').MembershipPlan
) {
  const { mockMemberships, nextId, calculateExpiryDate } = await import('../data/mockData');
  const ts = new Date().toISOString();
  const membership = {
    membershipId: nextId('membership'),
    gymId,
    memberId,
    plan,
    startDate: ts,
    expiryDate: calculateExpiryDate(plan),
    status: 'active' as const,
  };
  mockMemberships.push(membership);
  return { ...membership };
}

export async function renewMembership(
  gymId: string,
  membershipId: string,
  plan: import('../types').MembershipPlan
) {
  const { mockMemberships, calculateExpiryDate } = await import('../data/mockData');
  const index = mockMemberships.findIndex((m) => m.membershipId === membershipId);
  if (index !== -1) {
    mockMemberships[index] = {
      ...mockMemberships[index],
      plan,
      expiryDate: calculateExpiryDate(plan),
      status: 'active',
      startDate: new Date().toISOString(),
    };
  }
}

export async function suspendMembership(gymId: string, membershipId: string) {
  const { mockMemberships } = await import('../data/mockData');
  const index = mockMemberships.findIndex((m) => m.membershipId === membershipId && m.gymId === gymId);
  if (index !== -1) mockMemberships[index].status = 'suspended';
}
