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

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return `This action return all coffees.Limit ${limit},offsets ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `返回#[${id}] coffee`;
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return `This action update #${id} coffee`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes #${id} coffee`;
  }
}
