import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Patch,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import {
  CreateClientDto,
  CreateClientPhoneDto,
} from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
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

  @Get()
  @ApiOperation({
    summary: 'List all clients',
    description: 'Retrieves all registered clients with their contact phones',
  })
  @ApiResponse({
    status: 200,
    description: 'Clients retrieved successfully',
    type: [Client],
  })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get client details',
    description: 'Finds a client by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Client UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Client found', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (uuid is expected)',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client', description: 'Updates client data' })
  @ApiParam({
    name: 'id',
    description: 'Client UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Client updated', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Conflict: Tax ID already registered' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete client', description: 'Removes client record' })
  @ApiParam({
    name: 'id',
    description: 'Client UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Conflict: Client cannot be deleted' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.delete(id);
  }
}