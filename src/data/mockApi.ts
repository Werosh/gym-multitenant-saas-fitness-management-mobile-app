import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  mockUsers,
  mockGyms,
  mockCredentials,
  mockWorkouts,
  mockAttendance,
  mockMemberships,
  delay,
  nextId,
  calculateExpiryDate,
} from './mockData';
import {
  RegisterPayload,
  UserProfile,
  CreateGymPayload,
  CreateMemberPayload,
  Gym,
} from '../types';

const SESSION_KEY = '@mygymhere_mock_session';

export async function mockLogin(email: string, password: string): Promise<UserProfile> {
  await delay();
  const normalized = email.trim().toLowerCase();
  const storedPassword = mockCredentials[normalized];
  if (!storedPassword || storedPassword !== password) {
    throw new Error('Invalid email or password.');
  }
  const profile = mockUsers.find((u) => u.email.toLowerCase() === normalized);
  if (!profile) throw new Error('User not found.');
  await AsyncStorage.setItem(SESSION_KEY, profile.userId);
  return { ...profile };
}

export async function mockLoginAsUser(userId: string): Promise<UserProfile> {
  await delay(150);
  const profile = mockUsers.find((u) => u.userId === userId);
  if (!profile) throw new Error('Demo user not found.');
  await AsyncStorage.setItem(SESSION_KEY, profile.userId);
  return { ...profile };
}

export async function mockRegister(payload: RegisterPayload): Promise<UserProfile> {
  await delay();
  const email = payload.email.trim().toLowerCase();
  if (mockUsers.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('An account with this email already exists.');
  }

  let gymId: string | null = null;
  if (payload.role !== 'owner' && payload.role !== 'super_admin') {
    if (!payload.gymCode) throw new Error('Gym code is required.');
    const gym = mockGyms.find((g) => g.gymCode === payload.gymCode!.toUpperCase());
    if (!gym) throw new Error('Invalid gym code. Please check and try again.');
    gymId = gym.gymId;
  }

  const ts = new Date().toISOString();
  const profile: UserProfile = {
    userId: nextId('user'),
    gymId,
    name: payload.name,
    email: payload.email.trim(),
    role: payload.role,
    age: payload.age,
    weight: payload.weight,
    height: payload.height,
    goal: payload.goal,
    createdAt: ts,
    updatedAt: ts,
  };

  mockUsers.push(profile);
  mockCredentials[email] = payload.password;
  await AsyncStorage.setItem(SESSION_KEY, profile.userId);
  return { ...profile };
}

export async function mockLogout(): Promise<void> {
  await delay(100);
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function mockRestoreSession(): Promise<UserProfile | null> {
  await delay(100);
  const userId = await AsyncStorage.getItem(SESSION_KEY);
  if (!userId) return null;
  const profile = mockUsers.find((u) => u.userId === userId);
  return profile ? { ...profile } : null;
}

export async function mockFetchProfile(userId: string): Promise<UserProfile | null> {
  await delay(100);
  const profile = mockUsers.find((u) => u.userId === userId);
  return profile ? { ...profile } : null;
}

export async function mockUpdateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  await delay();
  const index = mockUsers.findIndex((u) => u.userId === userId);
  if (index === -1) throw new Error('User not found.');
  mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date().toISOString() };
}

export async function mockGetGymById(gymId: string): Promise<Gym | null> {
  await delay(100);
  const gym = mockGyms.find((g) => g.gymId === gymId);
  return gym ? { ...gym } : null;
}

export async function mockGetGymByCode(gymCode: string): Promise<Gym | null> {
  await delay();
  const gym = mockGyms.find((g) => g.gymCode === gymCode.toUpperCase());
  return gym ? { ...gym } : null;
}

export async function mockCreateGym(ownerId: string, payload: CreateGymPayload): Promise<Gym> {
  await delay();
  const gym: Gym = {
    gymId: nextId('gym'),
    gymName: payload.gymName,
    location: payload.location,
    ownerId,
    gymCode: 'GYM' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    subscriptionPlan: payload.subscriptionPlan,
    createdAt: new Date().toISOString(),
  };
  mockGyms.push(gym);

  const ownerIndex = mockUsers.findIndex((u) => u.userId === ownerId);
  if (ownerIndex !== -1) {
    mockUsers[ownerIndex] = {
      ...mockUsers[ownerIndex],
      gymId: gym.gymId,
      role: 'owner',
      updatedAt: new Date().toISOString(),
    };
  }
  return { ...gym };
}

export async function mockUpdateGym(
  gymId: string,
  updates: Partial<Pick<Gym, 'gymName' | 'location' | 'subscriptionPlan'>>
): Promise<void> {
  await delay();
  const index = mockGyms.findIndex((g) => g.gymId === gymId);
  if (index === -1) throw new Error('Gym not found.');
  mockGyms[index] = { ...mockGyms[index], ...updates };
}

export async function mockGetAllGyms(): Promise<Gym[]> {
  await delay();
  return mockGyms.map((g) => ({ ...g }));
}

export async function mockGetMembersByGym(gymId: string): Promise<UserProfile[]> {
  await delay();
  return mockUsers.filter((u) => u.gymId === gymId && u.role === 'member').map((u) => ({ ...u }));
}

export async function mockGetTrainersByGym(gymId: string): Promise<UserProfile[]> {
  await delay();
  return mockUsers.filter((u) => u.gymId === gymId && u.role === 'trainer').map((u) => ({ ...u }));
}

export async function mockGetMembersByTrainer(gymId: string, trainerId: string): Promise<UserProfile[]> {
  await delay();
  return mockUsers
    .filter((u) => u.gymId === gymId && u.role === 'member' && u.trainerId === trainerId)
    .map((u) => ({ ...u }));
}

export async function mockCreateMember(gymId: string, payload: CreateMemberPayload): Promise<UserProfile> {
  await delay();
  const email = payload.email.trim().toLowerCase();
  if (mockCredentials[email]) throw new Error('Email already in use.');

  const ts = new Date().toISOString();
  const member: UserProfile = {
    userId: nextId('user'),
    gymId,
    name: payload.name,
    email: payload.email.trim(),
    role: 'member',
    age: payload.age,
    weight: payload.weight,
    height: payload.height,
    goal: payload.goal,
    trainerId: payload.trainerId,
    membershipStatus: 'active',
    expiryDate: calculateExpiryDate(payload.plan),
    createdAt: ts,
    updatedAt: ts,
  };
  mockUsers.push(member);
  mockCredentials[email] = payload.password;

  mockMemberships.push({
    membershipId: nextId('membership'),
    gymId,
    memberId: member.userId,
    plan: payload.plan,
    startDate: ts,
    expiryDate: calculateExpiryDate(payload.plan),
    status: 'active',
  });
  return { ...member };
}

export async function mockUpdateMember(
  gymId: string,
  memberId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  await delay();
  const index = mockUsers.findIndex((u) => u.userId === memberId && u.gymId === gymId);
  if (index === -1) throw new Error('Member not found.');
  mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date().toISOString() };
}

export async function mockDeleteMember(gymId: string, memberId: string): Promise<void> {
  await delay();
  const index = mockUsers.findIndex((u) => u.userId === memberId && u.gymId === gymId);
  if (index !== -1) mockUsers.splice(index, 1);
}

export async function mockCreateTrainer(gymId: string, payload: { name: string; email: string; password: string }): Promise<UserProfile> {
  await delay();
  const email = payload.email.trim().toLowerCase();
  if (mockCredentials[email]) throw new Error('Email already in use.');

  const ts = new Date().toISOString();
  const trainer: UserProfile = {
    userId: nextId('user'),
    gymId,
    name: payload.name,
    email: payload.email.trim(),
    role: 'trainer',
    createdAt: ts,
    updatedAt: ts,
  };
  mockUsers.push(trainer);
  mockCredentials[email] = payload.password;
  return { ...trainer };
}

export async function mockDeleteTrainer(gymId: string, trainerId: string): Promise<void> {
  await delay();
  const index = mockUsers.findIndex((u) => u.userId === trainerId && u.gymId === gymId);
  if (index !== -1) mockUsers.splice(index, 1);
}

export async function mockGetWorkoutsByGym(gymId: string) {
  await delay();
  return mockWorkouts.filter((w) => w.gymId === gymId).map((w) => ({ ...w }));
}

export async function mockGetWorkoutsByMember(gymId: string, memberId: string) {
  await delay();
  return mockWorkouts.filter((w) => w.gymId === gymId && w.memberId === memberId).map((w) => ({ ...w }));
}

export async function mockGetWorkoutsByTrainer(gymId: string, trainerId: string) {
  await delay();
  return mockWorkouts.filter((w) => w.gymId === gymId && w.trainerId === trainerId).map((w) => ({ ...w }));
}

export async function mockCreateWorkout(
  gymId: string,
  memberId: string,
  trainerId: string,
  title: string,
  exercises: import('../types').Exercise[]
) {
  await delay();
  const ts = new Date().toISOString();
  const workout = {
    workoutId: nextId('workout'),
    gymId,
    memberId,
    trainerId,
    title,
    exercises,
    createdAt: ts,
    updatedAt: ts,
  };
  mockWorkouts.push(workout);
  return { ...workout };
}

export async function mockUpdateWorkout(
  gymId: string,
  workoutId: string,
  updates: { title?: string; exercises?: import('../types').Exercise[] }
) {
  await delay();
  const index = mockWorkouts.findIndex((w) => w.workoutId === workoutId && w.gymId === gymId);
  if (index === -1) throw new Error('Workout not found.');
  mockWorkouts[index] = { ...mockWorkouts[index], ...updates, updatedAt: new Date().toISOString() };
}

export async function mockGetAttendanceByGym(gymId: string) {
  await delay();
  return mockAttendance
    .filter((a) => a.gymId === gymId)
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .map((a) => ({ ...a }));
}

export async function mockGetAttendanceByMember(gymId: string, memberId: string) {
  await delay();
  return mockAttendance
    .filter((a) => a.gymId === gymId && a.memberId === memberId)
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .map((a) => ({ ...a }));
}

export async function mockGetActiveCheckIn(gymId: string, memberId: string) {
  await delay(100);
  const record = mockAttendance.find((a) => a.gymId === gymId && a.memberId === memberId && !a.checkOutTime);
  return record ? { ...record } : null;
}

export async function mockCheckIn(gymId: string, memberId: string, memberName?: string) {
  await delay();
  const record = {
    attendanceId: nextId('att'),
    gymId,
    memberId,
    memberName,
    checkInTime: new Date().toISOString(),
  };
  mockAttendance.unshift(record);
  return { ...record };
}

export async function mockCheckOut(gymId: string, attendanceId: string) {
  await delay();
  const index = mockAttendance.findIndex((a) => a.attendanceId === attendanceId && a.gymId === gymId);
  if (index !== -1) {
    mockAttendance[index].checkOutTime = new Date().toISOString();
  }
}

export async function mockGetTodayAttendanceCount(gymId: string) {
  await delay(100);
  const today = new Date().toDateString();
  return mockAttendance.filter(
    (a) => a.gymId === gymId && new Date(a.checkInTime).toDateString() === today
  ).length;
}

export async function mockGetMembershipsByGym(gymId: string) {
  await delay();
  return mockMemberships.filter((m) => m.gymId === gymId).map((m) => ({ ...m }));
}

export async function mockGetMembershipByMember(gymId: string, memberId: string) {
  await delay(100);
  const m = mockMemberships.find((m) => m.gymId === gymId && m.memberId === memberId);
  return m ? { ...m } : null;
}

export { getMembershipStatus } from './mockData';
