import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRepository.find({ relations: ['aerolineas'] });
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    const aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: id },
      relations: ['aerolineas'],
    });
    if (!aeropuerto) {
      throw new BusinessLogicException(
        'Aeropuerto not found',
        BusinessError.NOT_FOUND,
      );
    }
    return aeropuerto;
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(
    id: string,
    aeropuerto: AeropuertoEntity,
  ): Promise<AeropuertoEntity> {
    const persistedAeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: id },
      relations: ['aerolineas'],
    });
    if (!persistedAeropuerto) {
      throw new BusinessLogicException(
        'Aeropuerto not found',
        BusinessError.NOT_FOUND,
      );
    }

    return await this.aeropuertoRepository.save({
      ...persistedAeropuerto,
      ...aeropuerto,
    });
  }

  async delete(id: string): Promise<void> {
    const aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: id },
      relations: ['aerolineas'],
    });
    if (!aeropuerto) {
      throw new BusinessLogicException(
        'Aeropuerto not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.aeropuertoRepository.remove(aeropuerto);
  }
}
