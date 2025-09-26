import { ApiProperty } from '@nestjs/swagger';
import { LoadType } from '../entities/upload.entity';
import { IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { OrderDto } from './create-order.dto';
import { Type } from 'class-transformer';

export class CreateSalesLoadDto {
  @ApiProperty({ example: 'ORDERS_MAY2025.xlsx', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ example: 'order' })
  @IsString()
  @IsNotEmpty()
  fileType: 'order';

  @ApiProperty({ 
    type: 'array',
    description: 'Array de órdenes de venta procesadas del Excel'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  data: OrderDto[];
}

export class SalesLoadResponseDto {
  @ApiProperty({ example: 'b3cdf3b7-3d8a-4bb9-80ed-bccf6ff44f53' })
  loadId: string;

  @ApiProperty({ example: 'ORDERS_MAY2025.xlsx' })
  fileName: string;

  @ApiProperty({ enum: LoadType, example: LoadType.SALE })
  loadType: LoadType;

  @ApiProperty({ example: '2025-06-30T15:04:00Z' })
  loadDate: Date;

  @ApiProperty({ example: 8 })
  totalSheets: number;

  @ApiProperty({ example: 250 })
  totalTransactions: number;

  @ApiProperty({ example: true })
  success: boolean;
}