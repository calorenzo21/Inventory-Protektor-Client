import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ClientPhone } from 'src/clients/entities/client-phone-entity';
import { SheetLoad } from 'src/upload/entities/sheet-upload.entity';
import { Transaction } from 'src/upload/entities/transaction.entity';
import { Load } from 'src/upload/entities/upload.entity';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: +configService.getOrThrow('DB_PORT'),
  database: configService.getOrThrow('DB_NAME'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  entities: [Product, Category, Client, ClientPhone, SheetLoad, Transaction, Load],
  migrations: ['migrations/**'],
});
