import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsEmail, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common/decorators/core/optional.decorator';

export class CreateClientPhoneDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    example: '+584121234567',
    description: 'Phone number with country code' 
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ 
    example: 'Sarah Johnson',
    description: 'Name of the primary contact' 
  })
  contactName: string;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ 
    example: 'Global Tech Solutions',
    description: 'Legal business name' 
  })
  businessName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    example: 'J-987654321',
    description: 'Tax identification number' 
  })
  taxId: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ 
    example: 'operations@globaltech.com',
    description: 'Official business email' 
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    example: '456 Innovation Blvd, Tech City',
    description: 'Legal business address' 
  })
  legalAddress: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClientPhoneDto)
  @ApiProperty({ 
    type: [CreateClientPhoneDto],
    description: 'List of contact phone numbers' 
  })
  phones: CreateClientPhoneDto[];
}