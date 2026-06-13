/**
 * Analytics placeholders for future dashboard charts.
 */

export interface AnalyticsData {
  monthlyRevenue: number[];
  memberGrowth: number[];
  attendanceTrend: number[];
  labels: string[];
}

export async function fetchOwnerAnalytics(_gymId: string): Promise<AnalyticsData> {
  return {
    monthlyRevenue: [1200, 1500, 1800, 2100, 2400, 2700],
    memberGrowth: [10, 15, 22, 28, 35, 42],
    attendanceTrend: [45, 52, 48, 60, 55, 62],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  };
}

export async function fetchTrainerAnalytics(_gymId: string, _trainerId: string) {
  return {
    sessionsCompleted: 24,
    memberProgressAvg: 12,
    activePlans: 8,
  };
}
