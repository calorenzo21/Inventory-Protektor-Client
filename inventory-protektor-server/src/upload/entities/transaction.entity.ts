import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { SheetLoad } from './sheet-upload.entity';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '99fbcb0b-0c33-4f3e-9e54-59dbea4bcc79',
    readOnly: true,
  })
  transactionId: string;

  /* FK → Product */
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  @Index('idx_transactions_product')
  @ApiProperty({ type: () => Product })
  product: Product;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({ enum: TransactionType, example: TransactionType.IN })
  type: TransactionType;

  @Column({ type: 'int' })
  @ApiProperty({ example: 25, minimum: 1 })
  @Check(`quantity > 0`)
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  @ApiProperty({ example: 125.5, type: 'number' })
  @Check(`unit_price > 0`)
  unitPrice: number;

  @Column({ name: 'transaction_date', type: 'timestamp' })
  @Index('idx_transactions_date')
  @ApiProperty({ example: '2025-05-22T10:45:00Z' })
  transactionDate: Date;

  /* FK → SheetLoad */
  @ManyToOne(() => SheetLoad, (sheet) => sheet.transactions)
  @JoinColumn({ name: 'sheet_load_id' })
  @ApiProperty({ type: () => SheetLoad })
  sheet: SheetLoad;
}
