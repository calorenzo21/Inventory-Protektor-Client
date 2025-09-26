'use server'

export interface DashboardMetrics {
  summary: {
    totalStock: number;
    totalValue: number;
    lowStockCount: number;
    lastMonthSold: number;
  };
  topProducts: Array<{
    model: string;
    units: number;
  }>;
  stockDistribution: Array<{
    model: string;
    units: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    units: number;
  }>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await fetch('http://localhost:8080/api/metrics/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Para obtener datos frescos
    });

    if (!response.ok) {
      throw new Error(`Error fetching dashboard metrics: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}