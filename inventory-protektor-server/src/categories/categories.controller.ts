import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new category',
    description: 'Registers a new product category in the system',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Category creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Category successfully created',
    type: Category,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data format',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Category name already exists',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all categories',
    description: 'Retrieves a complete list of registered categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories list retrieved successfully',
    type: [Category],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category details',
    description: 'Finds a specific category by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Category details retrieved successfully',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with specified ID',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (uuid is expected)',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
    description: 'Updates partial information of an existing category',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Partial category data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with specified ID',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete category',
    description: 'Permanently removes a category from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Category successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with specified ID',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Category contains associated products',
  })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}
