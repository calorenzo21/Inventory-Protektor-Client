import { IsUUID, IsString, IsNumber, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './create-product.dto';

export class PurchaseRequestDto {
  @IsUUID()
  id: string;

  @IsDateString()
  requestDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNumber()
  totalCost: number;

  @IsString()
  sheetName: string;
}