import { NavigatorScreenParams } from '@react-navigation/native';
import { UserProfile, Workout } from '../types';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type OwnerTabParamList = {
  Dashboard: undefined;
  Members: undefined;
  Trainers: undefined;
  Attendance: undefined;
  Gym: undefined;
};

export type OwnerStackParamList = {
  OwnerTabs: NavigatorScreenParams<OwnerTabParamList>;
  MemberForm: { member?: UserProfile };
  TrainerForm: undefined;
  GymSetup: undefined;
};

export type TrainerTabParamList = {
  Dashboard: undefined;
  Members: undefined;
  Workouts: undefined;
};

export type TrainerStackParamList = {
  TrainerTabs: NavigatorScreenParams<TrainerTabParamList>;
  WorkoutBuilder: { memberId: string; memberName: string; workout?: Workout };
  MemberProgress: { memberId: string; memberName: string };
};

export type MemberTabParamList = {
  Dashboard: undefined;
  Workouts: undefined;
  Attendance: undefined;
  Profile: undefined;
};

export type MemberStackParamList = {
  MemberTabs: NavigatorScreenParams<MemberTabParamList>;
};

export type AdminTabParamList = {
  Dashboard: undefined;
};

export type AdminStackParamList = {
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  OwnerStack: NavigatorScreenParams<OwnerStackParamList>;
  TrainerStack: NavigatorScreenParams<TrainerStackParamList>;
  MemberStack: NavigatorScreenParams<MemberStackParamList>;
  AdminStack: NavigatorScreenParams<AdminStackParamList>;
  GymSetup: undefined;
  GoogleRoleSetup: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
