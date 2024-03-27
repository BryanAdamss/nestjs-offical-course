import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
  Delete,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Res() res) {
    /** 使用底层express响应对象，不推荐，失去框架上层抽象意义 */
    res.status(200).send('返回所有coffee');
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
