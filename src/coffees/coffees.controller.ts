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
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  /**
   * 在构造函数中用CoffeesService类声明需要IoC容器注入此类型对象的实例
   * 并将实例化的对象赋值给coffeesService
   * CoffeesService必须在此controller的providers中声明
   * 且CoffeesService要被标注为@Injectable
   */
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    // return `This action return all coffees.Limit ${limit},offsets ${offset}`;

    return this.coffeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return `返回#[${id}] coffee`;
    return this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() body) {
    // return body;

    return this.coffeesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    // return `This action update #${id} coffee`;
    return this.coffeesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return `This action removes #${id} coffee`;
    return this.coffeesService.remove(id);
  }
}
