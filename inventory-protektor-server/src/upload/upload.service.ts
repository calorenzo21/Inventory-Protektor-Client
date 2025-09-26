import * as XLSX from 'xlsx';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Order, ProductData } from './interfaces/order-client.interface';
import { PurchaseRequest } from './interfaces/purchase-client.interface';
import { readOrderSheet } from './helpers/orders.helper';
import { readPurchaseSheet } from './helpers/purchase-request.helper';
import { Load, LoadType } from './entities/upload.entity';
import { SheetLoad } from './entities/sheet-upload.entity';
import { Client } from '../clients/entities/client.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import * as levenshtein from 'fast-levenshtein';
import {
  CreatePurchaseLoadDto,
  PurchaseLoadResponseDto,
} from './dto/create-purchase-load.dto';
import {
  CreateSalesLoadDto,
  SalesLoadResponseDto,
} from './dto/create-sales-upload.dto';
import { RevertLoadResponseDto } from './dto/revert-load.dto';

@Injectable()
export class LoadsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async readExcel(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file received');

    // Read the Excel file
    const workbook = XLSX.read(file.buffer);
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];

    const fileType = this.determineFileType(firstSheet);
    const sheetNames = workbook.SheetNames;

    if (fileType === 'order') {
      sheetNames.pop();
      const ordersData = await this.processOrderSheets(workbook, sheetNames);
      return { fileType, data: ordersData };
    } else {
      const purchaseRequests = await this.processPurchaseSheets(
        workbook,
        sheetNames,
      );
      return { fileType, data: purchaseRequests };
    }
  }

  async getLoadData(loadId: string) {
    // Obtener la carga con relaciones completas
    const load = await this.dataSource.getRepository(Load).findOne({
      where: { loadId },
      relations: {
        sheets: {
          transactions: {
            product: true,
          },
          client: true,
        },
      },
    });

    if (!load) {
      throw new NotFoundException(`Carga con ID ${loadId} no encontrada`);
    }

    // Determinar el tipo de archivo
    const fileType =
      load.loadType === LoadType.PURCHASE ? 'purchase_request' : 'order';

    // Mapear cada hoja a su estructura correspondiente
    const data = load.sheets.map((sheet) => {
      // Mapear transacciones a ProductData
      const products: ProductData[] = sheet.transactions.map((transaction) => ({
        id: transaction.product.productId,
        model: transaction.product.model,
        description: transaction.product.description,
        price: transaction.unitPrice,
        quantity: transaction.quantity,
        total: transaction.unitPrice * transaction.quantity,
        imageUrl: transaction.product.imageUrl,
        category: transaction.product.category
          ? transaction.product.category.name
          : 'Uncategorized',
      }));

      // Calcular total de la hoja
      const total = products.reduce((sum, product) => sum + product.total, 0);

      // Estructura para compras
      if (load.loadType === LoadType.PURCHASE) {
        const purchaseRequest: PurchaseRequest = {
          id: sheet.sheetLoadId,
          requestDate:
            sheet.transactions[0]?.transactionDate || sheet.processedDate,
          products,
          totalCost: total,
          sheetName: sheet.sheetName,
        };
        return purchaseRequest;
      }
      // Estructura para ventas
      else {
        const order: Order = {
          id: sheet.sheetLoadId,
          clientName: sheet.client?.businessName || 'Cliente no especificado',
          orderDate:
            sheet.transactions[0]?.transactionDate || sheet.processedDate,
          products,
          total,
          sheetName: sheet.sheetName,
        };
        return order;
      }
    });

    return { fileType, data };
  }

  async getAllLoadsHistory(): Promise<Load[]> {
    return this.dataSource.getRepository(Load).find({
      select: ['loadId', 'fileName', 'loadType', 'loadDate'],
      order: { loadDate: 'DESC' },
    });
  }

  private determineFileType(
    sheet: XLSX.WorkSheet,
  ): 'order' | 'purchase_request' {
    const purchaseTitleCell = sheet['E2'];
    return purchaseTitleCell && purchaseTitleCell.v === 'SOLICITUD DE PEDIDO'
      ? 'purchase_request'
      : 'order';
  }

  private async processOrderSheets(
    workbook: XLSX.WorkBook,
    sheetNames: string[],
  ): Promise<Order[]> {
    const ordersData: Order[] = [];

    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      ordersData.push(
        await readOrderSheet(sheet, this.productRepository, sheetName),
      );
    }

    return ordersData;
  }

  private async processPurchaseSheets(
    workbook: XLSX.WorkBook,
    sheetNames: string[],
  ): Promise<PurchaseRequest[]> {
    const purchaseRequests: PurchaseRequest[] = [];

    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      purchaseRequests.push(
        await readPurchaseSheet(sheet, this.productRepository, sheetName),
      );
    }

    return purchaseRequests;
  }

  async processPurchaseLoad(
    payload: CreatePurchaseLoadDto,
  ): Promise<PurchaseLoadResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear registro principal de carga
      const load = new Load();
      load.fileName = payload.fileName;
      load.loadType = LoadType.PURCHASE;
      load.loadDate = new Date();

      await queryRunner.manager.save(Load, load);

      let totalSheets = 0;
      let totalTransactions = 0;

      // Procesar cada solicitud de compra
      for (const purchaseRequest of payload.data) {
        totalSheets++;

        // Crear registro de hoja
        const sheetLoad = new SheetLoad();
        sheetLoad.sheetLoadId = purchaseRequest.id;
        sheetLoad.load = load;
        sheetLoad.sheetName = purchaseRequest.sheetName;
        sheetLoad.processedDate = new Date();

        await queryRunner.manager.save(SheetLoad, sheetLoad);

        const transactions = [];
        const productIds = purchaseRequest.products.map((p) => p.id);

        // Buscar todos los productos en una sola consulta
        const products = await queryRunner.manager.find(Product, {
          where: { productId: In(productIds) },
        });

        for (const productItem of purchaseRequest.products) {
          totalTransactions++;
          const product = products.find((p) => p.productId === productItem.id);

          if (!product) {
            throw new NotFoundException(
              `Producto con ID ${productItem.id} no encontrado`,
            );
          }

          product.stock += productItem.quantity;
          await queryRunner.manager.save(Product, product);

          const transaction = new Transaction();
          transaction.product = product;
          transaction.type = TransactionType.IN;
          transaction.quantity = productItem.quantity;
          transaction.unitPrice = productItem.price;
          transaction.transactionDate = new Date(purchaseRequest.requestDate);
          transaction.sheet = sheetLoad;

          transactions.push(transaction);
        }

        // Guardar transacciones en lote
        if (transactions.length > 0) {
          await queryRunner.manager.save(Transaction, transactions);
        }
      }

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        loadId: load.loadId,
        fileName: load.fileName,
        loadType: load.loadType,
        loadDate: load.loadDate,
        totalSheets,
        totalTransactions,
        success: true,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error procesando la carga de compras: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async processSalesLoad(
    payload: CreateSalesLoadDto,
  ): Promise<SalesLoadResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear registro principal de carga
      const load = new Load();
      load.fileName = payload.fileName;
      load.loadType = LoadType.SALE;
      load.loadDate = new Date();

      await queryRunner.manager.save(Load, load);

      let totalSheets = 0;
      let totalTransactions = 0;

      for (const order of payload.data) {
        totalSheets++;

        // Buscar o crear cliente
        const client = await this.findOrCreateClient(
          order.clientName,
          queryRunner.manager,
        );

        // Crear registro de hoja
        const sheetLoad = new SheetLoad();
        sheetLoad.sheetLoadId = order.id;
        sheetLoad.load = load;
        sheetLoad.sheetName = order.sheetName;
        sheetLoad.client = client;
        sheetLoad.processedDate = new Date();

        await queryRunner.manager.save(SheetLoad, sheetLoad);

        const transactions = [];
        const productIds = order.products.map((p) => p.id);

        // Buscar todos los productos en una sola consulta
        const products = await queryRunner.manager.find(Product, {
          where: { productId: In(productIds) },
        });

        for (const productItem of order.products) {
          totalTransactions++;
          const product = products.find((p) => p.productId === productItem.id);

          if (!product) {
            throw new NotFoundException(
              `Producto con ID ${productItem.id} no encontrado`,
            );
          }

          if (product.stock < productItem.quantity) {
            throw new BadRequestException(
              `Stock insuficiente para el producto ${product.model}. ` +
                `Disponible: ${product.stock}, Solicitado: ${productItem.quantity}`,
            );
          }

          product.stock -= productItem.quantity;
          await queryRunner.manager.save(Product, product);

          const transaction = new Transaction();
          transaction.product = product;
          transaction.type = TransactionType.OUT;
          transaction.quantity = productItem.quantity;
          transaction.unitPrice = productItem.price;
          transaction.transactionDate = new Date(order.orderDate);
          transaction.sheet = sheetLoad;

          transactions.push(transaction);
        }

        // Guardar transacciones en lote
        if (transactions.length > 0) {
          await queryRunner.manager.save(Transaction, transactions);
        }
      }

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        loadId: load.loadId,
        fileName: load.fileName,
        loadType: load.loadType,
        loadDate: load.loadDate,
        totalSheets,
        totalTransactions,
        success: true,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error procesando la carga de ventas: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async revertLoad(loadId: string): Promise<RevertLoadResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log(
        `🔍 Iniciando proceso de reversión REAL para carga ID: ${loadId}`,
      );

      // Obtener información de la carga
      const load = await queryRunner.manager.findOne(Load, {
        where: { loadId },
        relations: [
          'sheets',
          'sheets.transactions',
          'sheets.transactions.product',
        ],
      });

      if (!load) {
        console.log(`❌ Carga con ID ${loadId} no encontrada`);
        throw new NotFoundException(`Carga con ID ${loadId} no encontrada`);
      }

      console.log(`✅ Carga encontrada: ${loadId}`);
      console.log(`📋 Número de hojas encontradas: ${load.sheets.length}`);

      let revertedTransactions = 0;
      let revertedSheets = 0;

      // Mapa para trackear los cambios de stock acumulativos por producto
      const stockChanges = new Map<string, number>();

      // PASO 1: Calcular todos los cambios SIN aplicarlos
      console.log(`\n🧮 PASO 1: CALCULANDO CAMBIOS (sin aplicar)`);
      for (const sheet of load.sheets) {
        for (const transaction of sheet.transactions) {
          const productId = transaction.product.productId;
          const currentChange = stockChanges.get(productId) || 0;

          let stockChange: number;
          if (transaction.type === TransactionType.IN) {
            stockChange = -transaction.quantity; // Restar porque era una entrada
          } else {
            stockChange = transaction.quantity; // Sumar porque era una salida
          }

          const newTotalChange = currentChange + stockChange;
          stockChanges.set(productId, newTotalChange);

          console.log(
            `   Producto ${transaction.product.model}: cambio +${stockChange} (total: ${newTotalChange})`,
          );
        }
      }

      // PASO 2: Verificar que ningún producto quede con stock negativo
      console.log(`\n🔍 PASO 2: VERIFICANDO STOCKS FINALES`);
      let hasNegativeStock = false;
      for (const [productId, totalChange] of stockChanges.entries()) {
        const product = load.sheets
          .flatMap((s) => s.transactions)
          .find((t) => t.product.productId === productId)?.product;

        if (product) {
          const finalStock = product.stock + totalChange;
          console.log(
            `   ${product.model}: stock actual ${product.stock} + cambio ${totalChange} = ${finalStock}`,
          );

          if (finalStock < 0) {
            console.log(`   ❌ ERROR: Stock negativo detectado!`);
            hasNegativeStock = true;
          }
        }
      }

      if (hasNegativeStock) {
        throw new Error(
          'No se puede proceder: algunos productos quedarían con stock negativo',
        );
      }

      console.log(
        `✅ Verificación completada: todos los stocks finales son válidos`,
      );

      // PASO 3: Aplicar cambios en el stock Y verificar después de cada update
      console.log(`\n💾 PASO 3: APLICANDO CAMBIOS AL INVENTARIO`);

      // Recargar productos frescos de la DB para evitar problemas de concurrencia
      const productsToUpdate = Array.from(stockChanges.keys());

      for (const productId of productsToUpdate) {
        const totalChange = stockChanges.get(productId)!;

        // Obtener el producto fresco de la DB
        const freshProduct = await queryRunner.manager.findOne(Product, {
          where: { productId },
        });

        if (!freshProduct) {
          throw new Error(
            `Producto ${productId} no encontrado al intentar actualizar`,
          );
        }

        const originalStock = freshProduct.stock;
        const newStock = originalStock + totalChange;

        console.log(`   📦 Actualizando ${freshProduct.model}:`);
        console.log(`      Stock antes: ${originalStock}`);
        console.log(`      Cambio total: ${totalChange}`);
        console.log(`      Stock después: ${newStock}`);

        // Actualizar el stock
        freshProduct.stock = newStock;
        await queryRunner.manager.save(Product, freshProduct);

        // VERIFICACIÓN INMEDIATA: Leer de nuevo para confirmar
        const verificationProduct = await queryRunner.manager.findOne(Product, {
          where: { productId },
        });

        if (verificationProduct?.stock !== newStock) {
          throw new Error(
            `Verificación fallida: Expected ${newStock}, got ${verificationProduct?.stock} para producto ${freshProduct.model}`,
          );
        }

        console.log(
          `      ✅ Verificado: Stock actualizado correctamente a ${verificationProduct.stock}`,
        );
      }

      // PASO 4: Eliminar transacciones
      console.log(`\n🗑️  PASO 4: ELIMINANDO TRANSACCIONES`);
      for (const sheet of load.sheets) {
        revertedSheets++;
        const transactionCount = sheet.transactions.length;
        revertedTransactions += transactionCount;

        console.log(
          `   Eliminando ${transactionCount} transacciones de hoja ${sheet.sheetLoadId}`,
        );

        const deleteResult = await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(Transaction)
          .where('sheet_load_id = :sheetLoadId', {
            sheetLoadId: sheet.sheetLoadId,
          })
          .execute();

        console.log(`   ✅ Eliminadas ${deleteResult.affected} transacciones`);

        if (deleteResult.affected !== transactionCount) {
          throw new Error(
            `Error eliminando transacciones: expected ${transactionCount}, deleted ${deleteResult.affected}`,
          );
        }
      }

      // PASO 5: Eliminar hojas de carga
      console.log(`\n🗑️  PASO 5: ELIMINANDO HOJAS DE CARGA`);
      const deleteSheetsResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(SheetLoad)
        .where('load_id = :loadId', { loadId })
        .execute();

      console.log(
        `   ✅ Eliminadas ${deleteSheetsResult.affected} hojas de carga`,
      );

      if (deleteSheetsResult.affected !== load.sheets.length) {
        throw new Error(
          `Error eliminando hojas: expected ${load.sheets.length}, deleted ${deleteSheetsResult.affected}`,
        );
      }

      // PASO 6: Eliminar la carga principal
      console.log(`\n🗑️  PASO 6: ELIMINANDO CARGA PRINCIPAL`);
      const deleteLoadResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Load)
        .where('load_id = :loadId', { loadId })
        .execute();

      console.log(`   ✅ Eliminada la carga principal`);

      if (deleteLoadResult.affected !== 1) {
        throw new Error(
          `Error eliminando carga: expected 1, deleted ${deleteLoadResult.affected}`,
        );
      }

      // PASO 7: Verificación final de stocks
      console.log(`\n🔍 PASO 7: VERIFICACIÓN FINAL DE STOCKS`);
      for (const productId of productsToUpdate) {
        const totalChange = stockChanges.get(productId)!;
        const finalProduct = await queryRunner.manager.findOne(Product, {
          where: { productId },
        });

        if (!finalProduct) {
          throw new Error(
            `Producto ${productId} no encontrado en verificación final`,
          );
        }

        console.log(
          `   ${finalProduct.model}: Stock final = ${finalProduct.stock}`,
        );
      }

      // TODO OK - Confirmar transacción
      console.log(`\n✅ CONFIRMANDO TRANSACCIÓN`);
      await queryRunner.commitTransaction();

      console.log(`\n🎉 PROCESO COMPLETADO EXITOSAMENTE`);
      console.log(`   📊 Resumen final:`);
      console.log(`   - Hojas procesadas: ${revertedSheets}`);
      console.log(`   - Transacciones revertidas: ${revertedTransactions}`);
      console.log(`   - Productos actualizados: ${productsToUpdate.length}`);

      return {
        success: true,
        message: `Carga revertida exitosamente - ${revertedSheets} hojas y ${revertedTransactions} transacciones`,
        loadId,
        revertedSheets,
        revertedTransactions,
      };
    } catch (error) {
      console.log(`\n❌ ERROR en el proceso de reversión:`);
      console.log(`   Mensaje: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);

      await queryRunner.rollbackTransaction();
      throw new Error(`Error revirtiendo la carga: ${error.message}`);
    } finally {
      console.log(`\n🔚 Liberando conexión del query runner`);
      await queryRunner.release();
    }
  }

  private async findOrCreateClient(
    clientName: string,
    manager: any, // Manager del queryRunner
    threshold = 0.85,
  ): Promise<Client> {
    // Búsqueda exacta
    const exactMatch = await manager.findOne(Client, {
      where: { businessName: clientName },
    });
    if (exactMatch) return exactMatch;

    // Búsqueda aproximada con Levenshtein
    const clients = await manager.find(Client);
    let bestMatch: Client | null = null;
    let bestSimilarity = 0;

    for (const client of clients) {
      const distance = levenshtein.get(clientName, client.businessName);
      const maxLength = Math.max(clientName.length, client.businessName.length);
      const similarity = 1 - distance / maxLength;

      if (similarity > bestSimilarity && similarity >= threshold) {
        bestSimilarity = similarity;
        bestMatch = client;
      }
    }

    if (bestMatch) return bestMatch;

    // Crear nuevo cliente
    const newClient = new Client();
    newClient.businessName = clientName;
    return manager.save(Client, newClient);
  }
}
