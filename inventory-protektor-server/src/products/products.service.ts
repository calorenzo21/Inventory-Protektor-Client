import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        category: { id: createProductDto.categoryId },
      });
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Product model already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    const productos = await this.productRepository.find({
      where: { stock: MoreThan(0) },
      relations: ['category'],
    });

    const ordenEspecifico = [
      'PRD-110',
      'PRDP-110',
      'PEE-110',
      'PEEP-110',
      'PEEPHD-110',
      'PAR-110',
      'PAR-220',
      'PARPHD-220',
      'PARDA-110',
      'PARDA-220',
      'PARE-110',
      'PARE-220',
      'PARTE-110',
      'PARTE-220',
      'PARP-110',
      'PARP-220',
      'PARDAP-110',
      'PARDAP-220',
      'PAREP-110',
      'PAREP-220',
      'PARTEP-110',
      'PARTEP-220',
      'SPD-1320',
      'PMRDA-220',
      'USTD-220',
      'USTDA-220',
    ];

    // Crear un mapa para asignar posición en el orden
    const mapaOrden = new Map<string, number>();
    ordenEspecifico.forEach((modelo, index) => {
      mapaOrden.set(modelo, index);
    });

    // Ordenar los productos según la lista específica
    return productos.sort((a, b) => {
      const posicionA = mapaOrden.has(a.model)
        ? mapaOrden.get(a.model)!
        : Number.MAX_SAFE_INTEGER;
      const posicionB = mapaOrden.has(b.model)
        ? mapaOrden.get(b.model)!
        : Number.MAX_SAFE_INTEGER;

      return posicionA - posicionB;
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId: id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findOneByModel(model: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { model: model },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${model} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.preload({
      productId: id,
      ...updateProductDto,
      ...(updateProductDto.categoryId && {
        category: { id: updateProductDto.categoryId },
      }),
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Cannot update to existing product model');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
