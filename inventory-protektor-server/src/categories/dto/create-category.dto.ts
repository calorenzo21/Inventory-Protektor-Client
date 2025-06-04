import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'Unique category name',
    example: 'Electronics',
    maxLength: 50,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Optional category description',
    example: 'Electronic devices and accessories',
    required: false,
  })
  description?: string;
}
