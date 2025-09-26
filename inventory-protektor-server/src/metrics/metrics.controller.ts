import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService, DashboardMetrics } from './metrics.service';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard metrics',
    description: 'Returns comprehensive metrics for the dashboard including stock summary, top products, stock distribution, and monthly trends'
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'object',
          properties: {
            totalStock: { type: 'number', example: 3154 },
            totalValue: { type: 'number', example: 45177.15 },
            lowStockCount: { type: 'number', example: 7 },
            lastMonthSold: { type: 'number', example: 305 }
          }
        },
        topProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              model: { type: 'string', example: 'PRD-110' },
              units: { type: 'number', example: 186 }
            }
          }
        },
        stockDistribution: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              model: { type: 'string', example: 'PRD-110' },
              units: { type: 'number', example: 250 }
            }
          }
        },
        monthlyTrend: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: { type: 'string', example: 'Enero' },
              units: { type: 'number', example: 911 }
            }
          }
        }
      }
    }
  })
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.metricsService.getDashboardMetrics();
  }
}