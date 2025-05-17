import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aerolineaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.anytime(),
        paginaWeb: faker.internet.url(),
      });
      aerolineasList.push(aerolineaEntity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll Debería retornar un listado de aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne Debería retornar una aerolinea por ID', async () => {
    const storedAerolinea = aerolineasList[0];
    const aerolinea = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea?.nombre).toEqual(storedAerolinea.nombre);
    expect(aerolinea?.descripcion).toEqual(storedAerolinea.descripcion);
    expect(aerolinea?.fechaFundacion).toEqual(storedAerolinea.fechaFundacion);
    expect(aerolinea?.paginaWeb).toEqual(storedAerolinea.paginaWeb);
  });

  it('findOne Debería lanzar una excepción por una aerolinea inválida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Aerolinea not found',
    );
  });

  it('create should return a new museum', async () => {
    const aerolinea: AerolineaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.anytime(),
      paginaWeb: faker.internet.url(),
      aeropuerto: new AeropuertoEntity(),
    };

    const newAerolinea = await service.create(aerolinea);

    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity | null = await repository.findOne({
      where: { id: newAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea?.nombre).toEqual(newAerolinea.nombre);
    expect(storedAerolinea?.descripcion).toEqual(newAerolinea.descripcion);
    expect(storedAerolinea?.fechaFundacion).toEqual(
      newAerolinea.fechaFundacion,
    );
    expect(storedAerolinea?.paginaWeb).toEqual(newAerolinea.paginaWeb);
  });

  it('update Debería modificar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];

    aerolinea.nombre = 'New name';
    aerolinea.descripcion = 'New description';

    const updatedAerolinea: AerolineaEntity = await service.update(
      aerolinea.id,
      aerolinea,
    );
    expect(updatedAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity | null = await repository.findOne({
      where: { id: updatedAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea?.nombre).toEqual(updatedAerolinea.nombre);
    expect(storedAerolinea?.descripcion).toEqual(updatedAerolinea.descripcion);
  });

  it('update Debería lanzar una excepción por una aerolinea inválida', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea,
      nombre: 'New name',
      descripcion: 'New description',
    };
    await expect(() => service.update('0', aerolinea)).rejects.toHaveProperty(
      'message',
      'Aerolinea not found',
    );
  });
  it('delete Debería eliminar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    expect(
      await repository.findOne({ where: { id: aerolinea.id } }),
    ).toBeNull();
  });
  it('delete Debería lanzar una excepción por una aerolinea inválida', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Aerolinea not found',
    );
  });
});
