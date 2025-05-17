import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.string.alpha(3).toUpperCase(),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: [],
      });
      aeropuertosList.push(aeropuertoEntity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll Debería retornar un listado de aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne Debería retornar un aeropuerto por ID', async () => {
    const storedAeropuerto = aeropuertosList[0];
    const aeropuerto = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto?.nombre).toEqual(storedAeropuerto.nombre);
    expect(aeropuerto?.codigo).toEqual(storedAeropuerto.codigo);
    expect(aeropuerto?.pais).toEqual(storedAeropuerto.pais);
    expect(aeropuerto?.ciudad).toEqual(storedAeropuerto.ciudad);
  });
  it('findOne Debería lanzar una excepción para un aeropuerto inválido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Aeropuerto not found',
    );
  });
  it('create Debería crear un nuevo aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      nombre: faker.company.name(),
      codigo: faker.string.alpha(3).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
    };

    const newAeropuerto = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto = await repository.findOne({
      where: { id: newAeropuerto.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto?.nombre).toEqual(aeropuerto.nombre);
    expect(storedAeropuerto?.codigo).toEqual(aeropuerto.codigo);
    expect(storedAeropuerto?.pais).toEqual(aeropuerto.pais);
    expect(storedAeropuerto?.ciudad).toEqual(aeropuerto.ciudad);
  });
  it('update Debería actualizar un aeropuerto', async () => {
    const aeropuerto = aeropuertosList[0];
    aeropuerto.nombre = 'New name';
    aeropuerto.codigo = 'NEW';
    aeropuerto.pais = 'New country';
    aeropuerto.ciudad = 'New city';

    const updatedAeropuerto = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();

    const storedAeropuerto = await repository.findOne({
      where: { id: aeropuerto.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto?.nombre).toEqual(aeropuerto.nombre);
    expect(storedAeropuerto?.codigo).toEqual(aeropuerto.codigo);
    expect(storedAeropuerto?.pais).toEqual(aeropuerto.pais);
    expect(storedAeropuerto?.ciudad).toEqual(aeropuerto.ciudad);
  });
  it('update Debería lanzar una excepción para un aeropuerto inválido', async () => {
    let aeropuerto = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto,
      nombre: 'New name',
      codigo: 'NEW',
      pais: 'New country',
      ciudad: 'New city',
    };
    await expect(() => service.update('0', aeropuerto)).rejects.toHaveProperty(
      'message',
      'Aeropuerto not found',
    );
  });
  it('delete Debería eliminar un aeropuerto', async () => {
    const aeropuerto = aeropuertosList[0];
    await service.delete(aeropuerto.id);
    const deletedAeropuerto = await repository.findOne({
      where: { id: aeropuerto.id },
    });
    expect(deletedAeropuerto).toBeNull();
  });
  it('delete Debería lanzar una excepción para un aeropuerto inválido', async () => {
    const aeropuerto = aeropuertosList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Aeropuerto not found',
    );
  });
});
