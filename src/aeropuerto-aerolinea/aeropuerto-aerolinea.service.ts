import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

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
    });
    if (!airline) {
      throw new BusinessLogicException(
        'Aerolinea no encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    const airport = await this.aeropuertoRepository.findOne({
      where: { id: airportId },
      relations: ['aerolineas'],
    });
    if (!airport) {
      throw new BusinessLogicException(
        'Aeropuerto no encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const airportAirline = airport.aerolineas.find(
      (aerolinea) => aerolinea.id === airline.id,
    );

    if (!airportAirline) {
      throw new BusinessLogicException(
        'La aerolinea no está asociada al aeropuerto',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return airport;
  }
}
