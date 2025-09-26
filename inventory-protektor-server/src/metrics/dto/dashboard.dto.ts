import { ApiProperty } from '@nestjs/swagger';

// DTO para el resumen
export class DashboardSummaryDto {
  @ApiProperty({
    example: 3154,
    description: 'Total de unidades en inventario'
  })
  totalStock: number;

  @ApiProperty({
    example: 45177.15,
    description: 'Valor monetario total del inventario'
  })
  totalValue: number;

  @ApiProperty({
    example: 7,
    description: 'Cantidad de productos con stock por debajo del mínimo'
  })
  lowStockCount: number;

  @ApiProperty({
    example: 305,
    description: 'Unidades vendidas en el mes pasado'
  })
  lastMonthSold: number;
}

// DTO para productos con unidades
export class ProductUnitsDto {
  @ApiProperty({
    example: 'PRD-110',
    description: 'Modelo del producto'
  })
  model: string;

  @ApiProperty({
    example: 186,
    description: 'Unidades vendidas del producto'
  })
  units: number;
}

// DTO para tendencia mensual
export class MonthlyTrendDto {
  @ApiProperty({
    example: 'Enero',
    description: 'Nombre del mes'
  })
  month: string;

  @ApiProperty({
    example: 911,
    description: 'Unidades vendidas en ese mes'
  })
  units: number;
}

// DTO completo de respuesta
export class DashboardResponseDto {
  @ApiProperty({
    type: DashboardSummaryDto,
    description: 'Métricas principales del dashboard'
  })
  summary: DashboardSummaryDto;

  @ApiProperty({
    type: [ProductUnitsDto],
    description: 'Top 5 productos más vendidos el mes pasado',
    example: [
      { model: 'PRD-110', units: 186 },
      { model: 'PAR-220', units: 305 }
    ]
  })
  topProducts: ProductUnitsDto[];

  @ApiProperty({
    type: [ProductUnitsDto],
    description: 'Distribución de ventas por modelo (mes pasado)',
    example: [
      { model: 'PRD-110', units: 186 },
      { model: 'PAR-220', units: 305 }
    ]
  })
  salesDistribution: ProductUnitsDto[];

  @ApiProperty({
    type: [MonthlyTrendDto],
    description: 'Unidades vendidas en los últimos meses',
    example: [
      { month: 'Enero', units: 911 },
      { month: 'Febrero', units: 901 }
    ]
  })
  monthlyTrend: MonthlyTrendDto[];
}