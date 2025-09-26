import { Module } from '@nestjs/common';
import { LoadsService } from './upload.service';
import { LoadsController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Load } from './entities/upload.entity';
import { SheetLoad } from './entities/sheet-upload.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Load, SheetLoad, Transaction]),
    ProductsModule,
  ],
  controllers: [LoadsController],
  providers: [LoadsService],
})
export class UploadModule {}
