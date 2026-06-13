export {
  mockGetGymById as getGymById,
  mockGetGymByCode as getGymByCode,
  mockCreateGym as createGym,
  mockUpdateGym as updateGym,
  mockGetAllGyms as getAllGyms,
} from '../data/mockApi';

export async function linkUserToGym(userId: string, gymId: string): Promise<void> {
  const { mockUpdateProfile } = await import('../data/mockApi');
  await mockUpdateProfile(userId, { gymId });
}
