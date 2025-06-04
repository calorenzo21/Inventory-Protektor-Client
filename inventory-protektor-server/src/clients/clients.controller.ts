import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, CreateClientPhoneDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Register new client', 
    description: 'Creates a client record with contact information' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Client successfully registered',
    type: Client 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict: Tax ID already exists' 
  })
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Post(':id/phones')
  @ApiOperation({ 
    summary: 'Add contact phone', 
    description: 'Associates a new phone number with existing client' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Client UUID',
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Phone number added successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Client not found' 
  })
  async addPhone(
    @Param('id') clientId: string,
    @Body() phoneData: CreateClientPhoneDto
  ) {
    return this.clientsService.addPhone(clientId, phoneData);
  }

  @Delete(':clientId/phones/:phoneId')
  @ApiOperation({ 
    summary: 'Remove contact phone', 
    description: 'Deletes a phone number from client record' 
  })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiParam({ name: 'phoneId', description: 'Phone record UUID' })
  @ApiResponse({ status: 204, description: 'Phone number removed' })
  @ApiResponse({ status: 404, description: 'Phone record not found' })
  async removePhone(
    @Param('clientId') clientId: string,
    @Param('phoneId') phoneId: string
  ) {
    return this.clientsService.removePhone(phoneId);
  }
}