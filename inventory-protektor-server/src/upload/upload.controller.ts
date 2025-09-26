import {
  Controller, Post,
  UseInterceptors, UploadedFile,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBody, ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoadsService } from './upload.service';
import { CreatePurchaseLoadDto, PurchaseLoadResponseDto } from './dto/create-purchase-load.dto';
import { CreateSalesLoadDto, SalesLoadResponseDto } from './dto/create-sales-upload.dto';
import { RevertLoadResponseDto } from './dto/revert-load.dto';

@ApiTags('Loads')
@Controller('loads')
export class LoadsController {
  constructor(private readonly service: LoadsService) {}

  @Post('read')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  }))
  @ApiOperation({ summary: 'Read Excel file for purchases/sales preview' })
  @ApiBody({
    description: 'FormData with the Excel file (`file`) and load metadata',
    schema: {
      type: 'object',
      properties: {
        file:      { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Read processed successfully' })
  async read(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.readExcel(file);
  }

  @Post('purchase-loads')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: 'Procesar carga de solicitudes de compra',
    description: 'Procesa y guarda en la base de datos las solicitudes de compra extraídas de un archivo Excel'
  })
  @ApiBody({ 
    type: CreatePurchaseLoadDto,
    description: 'Datos de las solicitudes de compra a procesar'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Carga de compras procesada exitosamente',
    type: PurchaseLoadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  async processPurchaseLoad(
    @Body() createPurchaseLoadDto: CreatePurchaseLoadDto,
  ): Promise<PurchaseLoadResponseDto> {
    return this.service.processPurchaseLoad(createPurchaseLoadDto);
  }

  @Post('sales-loads')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: 'Procesar carga de órdenes de venta',
    description: 'Procesa y guarda en la base de datos las órdenes de venta extraídas de un archivo Excel'
  })
  @ApiBody({ 
    type: CreateSalesLoadDto,
    description: 'Datos de las órdenes de venta a procesar'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Carga de ventas procesada exitosamente',
    type: SalesLoadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  async processSalesLoad(
    @Body() createSalesLoadDto: CreateSalesLoadDto,
  ): Promise<SalesLoadResponseDto> {
    return this.service.processSalesLoad(createSalesLoadDto);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener historial de cargas procesadas',
    description: 'Recupera un listado de todas las cargas procesadas con información básica'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historial de cargas recuperado exitosamente',
  })
  async getLoadsHistory() {
    const loads = await this.service.getAllLoadsHistory();
    return loads.map(load => ({
      loadId: load.loadId,
      fileName: load.fileName,
      loadType: load.loadType,
      loadDate: load.loadDate
    }));
  }

  @Get(':loadId/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener datos de una carga procesada',
    description: 'Recupera los datos completos de una carga previamente procesada en el mismo formato que la lectura inicial de Excel'
  })
  @ApiParam({
    name: 'loadId',
    description: 'ID único de la carga procesada',
    example: 'b3cdf3b7-3d8a-4bb9-80ed-bccf6ff44f53',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Datos de carga recuperados exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Carga no encontrada',
  })
  async getLoadData(
    @Param('loadId') loadId: string
  ) {
    return this.service.getLoadData(loadId);
  }

  @Delete(':loadId/revert')
  @ApiOperation({ summary: 'Revertir una carga completa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Carga revertida exitosamente',
    type: RevertLoadResponseDto,
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Carga no encontrada' 
  })
  async revertLoad(@Param('loadId') loadId: string) {
    return this.service.revertLoad(loadId);
  }
}