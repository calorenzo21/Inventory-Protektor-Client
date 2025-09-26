import { IsUUID, IsString, IsNumber, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './create-product.dto';

export class OrderDto {
  @IsUUID()
  id: string;

  @IsString()
  clientName: string;

  @IsDateString()
  orderDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNumber()
  total: number;

  @IsString()
  sheetName: string;
}