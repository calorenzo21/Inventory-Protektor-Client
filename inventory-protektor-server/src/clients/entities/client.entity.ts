import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ClientPhone } from './client-phone-entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  id: string;

  @Column({ name: 'business_name', length: 100 })
  @ApiProperty({
    description: 'Legal business name',
    example: 'Tech Solutions Corp',
    maxLength: 100,
  })
  businessName: string;

  @Column({ name: 'tax_id', unique: true, nullable: true, length: 20 })
  @Index('idx_clients_tax_id', {
    unique: true,
    where: '"tax_id" IS NOT NULL',
  })
  @ApiProperty({
    description: 'Tax Identification Number (RIF/VAT)',
    example: 'J-123456789',
    maxLength: 20,
  })
  taxId: string;

  @Column({ name: 'email', length: 100, nullable: true })
  @ApiProperty({
    description: 'Official contact email',
    example: 'contact@techsolutions.com',
  })
  email: string;

  @Column({ name: 'legal_address', type: 'text', nullable: true })
  @ApiProperty({
    description: 'Legal business address',
    example: '123 Main Street, Tech Valley, CA 94025',
  })
  legalAddress: string;

  @Column({
    name: 'registration_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  @ApiProperty({
    description: 'Client registration timestamp',
    example: '2024-03-15T09:00:00Z',
    readOnly: true,
  })
  registrationDate: Date;

  @OneToMany(() => ClientPhone, (phone) => phone.client)
  @ApiProperty({
    description: 'Associated contact phones',
    type: () => [ClientPhone],
    required: false,
  })
  phones?: ClientPhone[];
}
