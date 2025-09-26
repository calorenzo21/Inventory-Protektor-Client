import { ApiProperty } from '@nestjs/swagger';
import { LoadType } from '../entities/upload.entity';
import { IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { PurchaseRequestDto } from './create-purchase-request.dto';
import { Type } from 'class-transformer';

export class CreatePurchaseLoadDto {
  @ApiProperty({ example: 'PURCHASES_MAY2025.xlsx', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ example: 'purchase_request' })
  @IsString()
  @IsNotEmpty()
  fileType: 'purchase_request';

  @ApiProperty({ 
    type: 'array',
    description: 'Array de solicitudes de compra procesadas del Excel'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseRequestDto)
  data: PurchaseRequestDto[];
}

export class PurchaseLoadResponseDto {
  @ApiProperty({ example: 'b3cdf3b7-3d8a-4bb9-80ed-bccf6ff44f53' })
  loadId: string;

  @ApiProperty({ example: 'PURCHASES_MAY2025.xlsx' })
  fileName: string;

  @ApiProperty({ enum: LoadType, example: LoadType.PURCHASE })
  loadType: LoadType;

  @ApiProperty({ example: '2025-06-30T15:04:00Z' })
  loadDate: Date;

  @ApiProperty({ example: 5 })
  totalSheets: number;

  @ApiProperty({ example: 125 })
  totalTransactions: number;

  @ApiProperty({ example: true })
  success: boolean;
}