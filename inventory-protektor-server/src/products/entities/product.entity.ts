import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  productId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index('idx_products_models')
  @ApiProperty({
    description: 'Unique product model identifier',
    example: 'PRD-110',
    maxLength: 20,
    required: true,
  })
  model: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  @Index('idx_productos_categoria')
  @ApiProperty({
    description: 'Associated product category',
    type: Category,
    example: { id: '550e8400-e29b-41d4-a716-446655440000' },
  })
  category: Category;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  @ApiProperty({
    description: 'Unit price in local currency',
    example: 299.99,
    minimum: 0.01,
  })
  precio: number;

  @Column({ default: 0 })
  @ApiProperty({
    description: 'Current available stock',
    example: 50,
    minimum: 0,
  })
  stock: number;

  @Column({ name: 'min_stock', default: 10 })
  @ApiProperty({
    description: 'Minimum stock threshold for alerts',
    example: 10,
    minimum: 1,
  })
  minStock: number;

  @Column({ name: 'imagen_url', length: 255, nullable: true })
  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/product.jpg',
    required: false,
  })
  imageUrl?: string;

  @Column({
    name: 'ultima_actualizacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: 'Last stock update timestamp',
    example: '2024-03-15T12:00:00Z',
    readOnly: true,
  })
  lastUpdated: Date;
}
