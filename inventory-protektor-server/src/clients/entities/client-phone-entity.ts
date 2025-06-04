import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from './client.entity';

@Entity()
export class ClientPhone {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true
  })
  id: string;

  @Column({ name: 'phone_number' })
  @ApiProperty({
    description: 'Full phone number with country code',
    example: '+584121234567'
  })
  phoneNumber: string;

  @Column({ name: 'contact_name', length: 50 })
  @ApiProperty({
    description: 'Name of the contact person',
    example: 'John Doe',
    maxLength: 50
  })
  contactName: string;

  @ManyToOne(() => Client, client => client.phones)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}