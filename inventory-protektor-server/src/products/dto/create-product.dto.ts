import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'Unique product model identifier',
    example: 'PRD-110',
    maxLength: 100,
  })
  model: string;

  @IsUUID()
  @ApiProperty({
    description: 'Associated category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  categoryId: string;

  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    description: 'Unit price in local currency',
    example: 299.99,
    minimum: 0.01,
  })
  precio: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Initial stock quantity',
    example: 100,
    minimum: 0,
  })
  stock: number;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Minimum stock threshold',
    example: 20,
    minimum: 1,
  })
  minStock: number;

  @IsUrl()
  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/product.jpg',
    required: false,
  })
  imageUrl?: string;
}
