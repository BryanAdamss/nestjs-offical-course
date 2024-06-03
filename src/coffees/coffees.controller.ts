import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('coffees')
export class CoffeesController {
  /**
   * 在构造函数中用CoffeesService类声明需要IoC容器注入此类型对象的实例
   * 并将实例化的对象赋值给coffeesService
   * CoffeesService必须在此controller的providers中声明
   * 且CoffeesService要被标注为@Injectable
   */
  constructor(private readonly coffeesService: CoffeesService) {}

  /** 用@SetMetadata添加元信息，如果多处用到，应该封装成自定义装饰器Public */
  // @SetMetadata('isPublic', true)
  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const coffee = this.coffeesService.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coffeesService.remove(id);
  }
}
