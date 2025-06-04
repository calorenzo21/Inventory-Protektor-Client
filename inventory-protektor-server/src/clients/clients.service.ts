import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientPhone } from './entities/client-phone-entity';
import { CreateClientDto, CreateClientPhoneDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientPhone)
    private phoneRepository: Repository<ClientPhone>
  ) {}

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create client
      const client = queryRunner.manager.create(Client, {
        businessName: createClientDto.businessName,
        taxId: createClientDto.taxId,
        email: createClientDto.email,
        legalAddress: createClientDto.legalAddress
      });

      const savedClient = await queryRunner.manager.save(client);

      // Create associated phones
      const phones = createClientDto.phones.map(phone => 
        queryRunner.manager.create(ClientPhone, {
          ...phone,
          client: savedClient
        })
      );
      
      await queryRunner.manager.save(phones);
      
      await queryRunner.commitTransaction();
      return await this.clientRepository.findOne({
        where: { id: savedClient.id },
        relations: ['phones']
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new ConflictException('Tax ID already registered');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async addPhone(clientId: string, phoneData: CreateClientPhoneDto): Promise<ClientPhone> {
    const client = await this.clientRepository.findOneBy({ id: clientId });
    if (!client) throw new NotFoundException('Client not found');
    
    const phone = this.phoneRepository.create({
      ...phoneData,
      client
    });
    
    return this.phoneRepository.save(phone);
  }

  async removePhone(phoneId: string): Promise<void> {
    const result = await this.phoneRepository.delete(phoneId);
    if (result.affected === 0) {
      throw new NotFoundException('Phone record not found');
    }
  }

  // Additional CRUD methods follow the same pattern
}