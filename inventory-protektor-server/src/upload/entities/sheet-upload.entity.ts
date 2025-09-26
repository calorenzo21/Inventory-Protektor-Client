import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Load } from './upload.entity';
import { Client } from '../../clients/entities/client.entity';
import { Transaction } from './transaction.entity';

@Entity({ name: 'sheet_loads' })
export class SheetLoad {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '8a3c93ad-405e-44fe-b954-4a9c6b017fe2',
    readOnly: true,
  })
  sheetLoadId: string;

  /* FK → Load */
  @ManyToOne(() => Load, (load) => load.sheets, { eager: true })
  @JoinColumn({ name: 'load_id' })
  @ApiProperty({ type: () => Load })
  load: Load;

  @Column({ name: 'sheet_name', length: 100 })
  @ApiProperty({ example: 'ORDER-123', maxLength: 100 })
  sheetName: string;

  /* FK → Client (only for sales) */
  @ManyToOne(() => Client, { nullable: true, eager: false })
  @JoinColumn({ name: 'client_id' })
  @ApiProperty({ type: () => Client, required: false })
  client?: Client;

  @CreateDateColumn({ name: 'processed_date' })
  @ApiProperty({ example: '2025-06-30T15:05:20Z', readOnly: true })
  processedDate: Date;

  @OneToMany(() => Transaction, (mov) => mov.sheet, { cascade: true })
  transactions: Transaction[];
}
