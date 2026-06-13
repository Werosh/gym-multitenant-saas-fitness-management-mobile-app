export {
  mockGetMembersByGym as getMembersByGym,
  mockGetMembersByTrainer as getMembersByTrainer,
  mockCreateMember as createMember,
  mockUpdateMember as updateMember,
  mockDeleteMember as deleteMember,
} from '../data/mockApi';

export { calculateExpiryDate } from '../data/mockData';

export async function assignTrainerToMember(
  gymId: string,
  memberId: string,
  trainerId: string
): Promise<void> {
  const { mockUpdateMember } = await import('../data/mockApi');
  await mockUpdateMember(gymId, memberId, { trainerId });
}
