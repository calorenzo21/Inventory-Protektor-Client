import { IsUUID, IsString, IsNumber } from 'class-validator';

export class ProductDto {
  @IsUUID()
  id: string;

  @IsString()
  model: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;

  @IsString()
  imageUrl: string;

  @IsString()
  category: string;
}
