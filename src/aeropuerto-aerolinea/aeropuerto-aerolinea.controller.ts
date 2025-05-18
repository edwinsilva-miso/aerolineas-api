/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoAerolineaController {
  constructor(
    private readonly aeropuertoAerolineaService: AeropuertoAerolineaService,
  ) {}

  @Post(':airlineId/airports/:airportId')
  async addAerolineaAeropuerto(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.aeropuertoAerolineaService.addAerolineaToAeropuerto(
      airportId,
      airlineId,
    );
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirlineId(@Param('airlineId') airlineId: string) {
    return await this.aeropuertoAerolineaService.findAirportsFromAirline(
      airlineId,
    );
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirlineId(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.aeropuertoAerolineaService.findAirportFromAirlineId(
      airportId,
      airlineId,
    );
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() aeropuertosDto: AeropuertoDto[],
  ) {
    const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto);
    return await this.aeropuertoAerolineaService.updateAirportsFromAirline(
      airlineId,
      aeropuertos,
    );
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async removeAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.aeropuertoAerolineaService.removeAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
