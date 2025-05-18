/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaEntity } from './aerolinea.entity';
import { AreolineaDto } from './areolinea.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
  constructor(private readonly aerolineaService: AerolineaService) {}

  @Get()
  async findAll() {
    return await this.aerolineaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.aerolineaService.findOne(id);
  }

  @Post()
  async create(@Body() aerolineaDto: AreolineaDto) {
    const aerolinea = plainToInstance(
      AerolineaEntity,
      aerolineaDto,
    ) as AerolineaEntity;
    return await this.aerolineaService.create(aerolinea);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() aerolineaDto: AreolineaDto) {
    const aerolinea = plainToInstance(
      AerolineaEntity,
      aerolineaDto,
    ) as AerolineaEntity;
    return await this.aerolineaService.update(id, aerolinea);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.aerolineaService.delete(id);
  }
}
