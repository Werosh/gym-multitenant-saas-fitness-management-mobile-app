export {
  mockGetWorkoutsByGym as getWorkoutsByGym,
  mockGetWorkoutsByMember as getWorkoutsByMember,
  mockGetWorkoutsByTrainer as getWorkoutsByTrainer,
  mockCreateWorkout as createWorkout,
  mockUpdateWorkout as updateWorkout,
} from '../data/mockApi';

export async function deleteWorkout(_gymId: string, workoutId: string): Promise<void> {
  const { mockWorkouts } = await import('../data/mockData');
  const index = mockWorkouts.findIndex((w) => w.workoutId === workoutId);
  if (index !== -1) mockWorkouts.splice(index, 1);
}
