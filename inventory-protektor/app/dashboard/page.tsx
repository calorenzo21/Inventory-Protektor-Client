import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { ChartTopSales } from "@/components/chart-top-sales"
import { ChartPieLabelList } from "@/components/chart-pie-label"
import { getDashboardMetrics } from "@/app/actions/get-dashboards-metrics"

// Función para generar colores únicos para cada modelo
const generateColors = (data: any[]) => {
  const colors = [
    "#fdffb6", "#a0c4ff", "#caffbf", "#ffadad", "#9bf6ff",
    "#ffd6a5", "#ffb3ba", "#bae1ff", "#c7ceea", "#ffc9c9"
  ];
  
  return data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length]
  }));
};

export default async function Page() {
  const dashboardData = await getDashboardMetrics();
  
  // Preparar datos para los gráficos
  const topProductsWithColors = generateColors(dashboardData.topProducts);
  const stockDistributionWithColors = generateColors(dashboardData.stockDistribution);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards summary={dashboardData.summary} />
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ChartTopSales chartData={topProductsWithColors} />
            </div>
            <div className="lg:col-span-4">
              <ChartPieLabelList chartData={stockDistributionWithColors} />
            </div>
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive chartData={dashboardData.monthlyTrend} />
          </div>
        </div>
      </div>
    </div>
  )
}