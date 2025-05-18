/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from './aeropuerto.entity';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
  constructor(private readonly aeropuertoService: AeropuertoService) {}

  @Get()
  async findAll() {
    return await this.aeropuertoService.findAll();
  }

  @Get(':id')
  async findOne(id: string) {
    return await this.aeropuertoService.findOne(id);
  }

  @Post()
  async create(@Body() aeropuertoDto: AeropuertoDto) {
    const aeropuerto = plainToInstance(
      AeropuertoEntity,
      aeropuertoDto,
    ) as AeropuertoEntity;
    return await this.aeropuertoService.create(aeropuerto);
  }

  @Put(':id')
  @HttpCode(204)
  async update(id: string, @Body() aeropuertoDto: AeropuertoDto) {
    const aeropuerto = plainToInstance(
      AeropuertoEntity,
      aeropuertoDto,
    ) as AeropuertoEntity;
    return await this.aeropuertoService.update(id, aeropuerto);
  }

  @Delete(':id')
  async delete(id: string) {
    return await this.aeropuertoService.delete(id);
  }
}
