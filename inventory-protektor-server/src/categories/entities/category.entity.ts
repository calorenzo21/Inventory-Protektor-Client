import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({
    description: 'Unique category name',
    example: 'Electronics',
    maxLength: 50,
    required: true,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Optional category description',
    example: 'Electronic devices and accessories',
    required: false,
  })
  description: string;
}
