import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoAerolineaService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
  ) {}

  async addAerolineaToAeropuerto(
    aeropuertoId: string,
    aerolineaId: string,
  ): Promise<AeropuertoEntity> {
    const aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: aeropuertoId },
      relations: ['aerolineas'],
    });

    if (!aeropuerto) {
      throw new BusinessLogicException(
        'Aeropuerto no encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
    });

    if (!aerolinea) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }

    aeropuerto.aerolineas = [...aeropuerto.aerolineas, aerolinea];
    return this.aeropuertoRepository.save(aeropuerto);
  }
  async findAirportsFromAirline(
    aerolineaId: string,
  ): Promise<AeropuertoEntity[]> {
    const aeropuertosList = await this.aeropuertoRepository.findBy({
      aerolineas: { id: aerolineaId },
    });

    if (!aeropuertosList || aeropuertosList.length === 0) {
      throw new BusinessLogicException(
        'No existen aeropuertos asociados a esta aerolinea',
        BusinessError.NOT_FOUND,
      );
    }

    return aeropuertosList;
  }
  async findAirportFromAirlineId(
    airportId: string,
    airlineId: string,
  ): Promise<AeropuertoEntity> {
    const airline = await this.aerolineaRepository.findOne({
      where: { id: airlineId },
      relations: ['aeropuertos'],
    });
    if (!airline) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    const airport = airline.aeropuertos.find(
      (aeropuerto) => aeropuerto.id === airportId,
    );

    if (!airport) {
      throw new BusinessLogicException(
        'Aeropuerto no encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return airport;
  }
  async updateAirportsFromAirline(
    airlineId: string,
    airports: AeropuertoEntity[],
  ): Promise<AerolineaEntity> {
    const airline = await this.aerolineaRepository.findOne({
      where: { id: airlineId },
      relations: ['aeropuertos'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }

    airline.aeropuertos = airports;
    return this.aerolineaRepository.save(airline);
  }

  async removeAiroportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AerolineaEntity> {
    const airline = await this.aerolineaRepository.findOne({
      where: { id: airlineId },
      relations: ['aeropuertos'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }

    const airport = airline.aeropuertos.find(
      (aeropuerto) => aeropuerto.id === airportId,
    );

    if (!airport) {
      throw new BusinessLogicException(
        'Aeropuerto no encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    airline.aeropuertos = airline.aeropuertos.filter(
      (aeropuerto) => aeropuerto.id !== airportId,
    );

    return this.aerolineaRepository.save(airline);
  }
}
