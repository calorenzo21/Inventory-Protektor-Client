import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import {
  Transaction,
  TransactionType,
} from '../upload/entities/transaction.entity';

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

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [summary, topProducts, stockDistribution, monthlyTrend] =
      await Promise.all([
        this.getSummaryMetrics(),
        this.getTopProducts(),
        this.getStockDistribution(),
        this.getMonthlyTrend(),
      ]);

    return {
      summary,
      topProducts,
      stockDistribution,
      monthlyTrend,
    };
  }

  private async getSummaryMetrics() {
    // Total stock y valor total
    const stockData = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock)', 'totalStock')
      .addSelect('SUM(product.stock * product.precio)', 'totalValue')
      .addSelect(
        'COUNT(CASE WHEN product.stock < product.minStock AND product.stock > 0 THEN 1 END)',
        'lowStockCount',
      )
      .getRawOne();

    // Ventas del último mes
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthNumber = lastMonth.getMonth() + 1; // getMonth() returns 0-11, so add 1

    // Valores hardcodeados para los meses de enero a junio
    const hardcodedValues = {
      1: 911, // Enero
      2: 901, // Febrero
      3: 849, // Marzo
      4: 1182, // Abril
      5: 1226, // Mayo
      6: 746, // Junio
    };

    let lastMonthSold = 0;

    // Si el mes anterior está entre enero y junio, usar valores hardcodeados
    if (lastMonthNumber >= 1 && lastMonthNumber <= 6) {
      lastMonthSold = hardcodedValues[lastMonthNumber];
    } else {
      // Para julio en adelante, usar datos reales de la base de datos
      lastMonth.setDate(1);

      const currentMonth = new Date();
      currentMonth.setDate(1);

      const lastMonthSales = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.quantity)', 'totalSold')
        .where('transaction.type = :type', { type: TransactionType.OUT })
        .andWhere('transaction.transactionDate >= :startDate', {
          startDate: lastMonth,
        })
        .andWhere('transaction.transactionDate < :endDate', {
          endDate: currentMonth,
        })
        .getRawOne();

      lastMonthSold = parseInt(lastMonthSales.totalSold) || 0;
    }

    return {
      totalStock: parseInt(stockData.totalStock) || 0,
      totalValue: parseFloat(stockData.totalValue) || 0,
      lowStockCount: parseInt(stockData.lowStockCount) || 0,
      lastMonthSold: lastMonthSold,
    };
  }

  private async getTopProducts() {
    const topProducts = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoin('transaction.product', 'product')
      .select('product.model', 'model')
      .addSelect('SUM(transaction.quantity)', 'units')
      .where('transaction.type = :type', { type: TransactionType.OUT })
      .groupBy('product.model')
      .orderBy('SUM(transaction.quantity)', 'DESC')
      .limit(5)
      .getRawMany();

    return topProducts.map((item) => ({
      model: item.model,
      units: parseInt(item.units),
    }));
  }

  private async getStockDistribution() {
    // Obtener la distribución del stock actual de productos
    const stockDistribution = await this.productRepository
      .createQueryBuilder('product')
      .select('product.model', 'model')
      .addSelect('product.stock', 'units')
      .where('product.stock > 0')
      .orderBy('product.stock', 'DESC')
      .getRawMany();

    return stockDistribution.map((item) => ({
      model: item.model,
      units: parseInt(item.units),
    }));
  }

  private async getMonthlyTrend() {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Valores hardcodeados para los meses de enero a junio
    const hardcodedValues = {
      1: 911, // Enero
      2: 901, // Febrero
      3: 849, // Marzo
      4: 1182, // Abril
      5: 1226, // Mayo
      6: 746, // Junio
    };

    const monthlyData = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('EXTRACT(MONTH FROM transaction.transactionDate)', 'month')
      .addSelect('SUM(transaction.quantity)', 'units')
      .where('transaction.type = :type', { type: TransactionType.OUT })
      .andWhere('EXTRACT(YEAR FROM transaction.transactionDate) = :year', {
        year: currentYear,
      })
      .groupBy('EXTRACT(MONTH FROM transaction.transactionDate)')
      .orderBy('EXTRACT(MONTH FROM transaction.transactionDate)', 'ASC')
      .getRawMany();

    // Crear array con todos los meses del año
    const monthlyTrend = [];
    for (let i = 0; i < 12; i++) {
      const monthNumber = i + 1;
      let units = 0;

      // Si es enero a junio, usar valores hardcodeados
      if (monthNumber >= 1 && monthNumber <= 6) {
        units = hardcodedValues[monthNumber];
      } else {
        // Para julio en adelante, usar datos de la base de datos
        const monthData = monthlyData.find(
          (data) => parseInt(data.month) === monthNumber,
        );
        units = monthData ? parseInt(monthData.units) : 0;
      }

      monthlyTrend.push({
        month: monthNames[i],
        units: units,
      });
    }

    return monthlyTrend;
  }
}
