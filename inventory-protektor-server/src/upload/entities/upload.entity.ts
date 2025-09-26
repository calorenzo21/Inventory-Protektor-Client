import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SheetLoad } from './sheet-upload.entity';

export enum LoadType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
}

@Entity({ name: 'loads' })
export class Load {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'b3cdf3b7-3d8a-4bb9-80ed-bccf6ff44f53',
    readOnly: true,
  })
  loadId: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255, unique: true })
  @ApiProperty({ example: 'ORDERS_MAY2025.xlsx', maxLength: 255 })
  fileName: string;

  @Column({ name: 'load_type', type: 'varchar', length: 10 })
  @ApiProperty({ enum: LoadType, example: LoadType.PURCHASE })
  loadType: LoadType;

  @CreateDateColumn({ name: 'load_date' })
  @ApiProperty({ example: '2025-06-30T15:04:00Z', readOnly: true })
  loadDate: Date;

  /* -------- relations -------- */

  @OneToMany(() => SheetLoad, (sheet) => sheet.load, { cascade: true })
  sheets: SheetLoad[];
}
