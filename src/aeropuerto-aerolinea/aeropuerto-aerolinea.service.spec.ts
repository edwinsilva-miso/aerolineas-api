import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { faker } from '@faker-js/faker/.';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoAerolineaService],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(
      AeropuertoAerolineaService,
    );
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: faker.string.alpha(3).toUpperCase(),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
      });
      aeropuertosList.push(aeropuerto);
    }
    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.anytime(),
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAerolineaToAeropuerto Debería agregar una aerolinea a un aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alpha(3).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.anytime(),
      paginaWeb: faker.internet.url(),
    });

    const result: AeropuertoEntity = await service.addAerolineaToAeropuerto(
      newAeropuerto.id,
      newAerolinea.id,
    );

    expect(result).not.toBeNull();
    expect(result.aerolineas).toHaveLength(1);
    expect(result.aerolineas[0].id).toEqual(newAerolinea.id);
    expect(result.aerolineas[0].nombre).toEqual(newAerolinea.nombre);
    expect(result.aerolineas[0].descripcion).toEqual(newAerolinea.descripcion);
    expect(result.aerolineas[0].fechaFundacion).toEqual(
      newAerolinea.fechaFundacion,
    );
    expect(result.aerolineas[0].paginaWeb).toEqual(newAerolinea.paginaWeb);
  });

  it('addAerolineaToAeropuerto Debería lanzar una excepción para un aeropuerto inválido', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.anytime(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() =>
      service.addAerolineaToAeropuerto('0', newAerolinea.id),
    ).rejects.toHaveProperty('message', 'Aeropuerto no encontrado');
  });

  it('findAirportFromAirlineId Debería retornar un aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity =
      await service.findAirportFromAirlineId(aeropuerto.id, aerolinea.id);

    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toEqual(aeropuerto.codigo);
    expect(storedAeropuerto.pais).toEqual(aeropuerto.pais);
    expect(storedAeropuerto.ciudad).toEqual(aeropuerto.ciudad);
  });

  it('findAirportFromAirlineId Debería lanzar una excepción para un aeropuerto inválido', async () => {
    await expect(() =>
      service.findAirportFromAirlineId('0', aerolinea.id),
    ).rejects.toHaveProperty('message', 'Aeropuerto no encontrado');
  });

  it('findAirportsFromAirline Debería retornar los aeropuertos de una aerolinea', async () => {
    const aeropuertos: AeropuertoEntity[] =
      await service.findAirportsFromAirline(aerolinea.id);

    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findAirportsFromAirline Debería lanzar una excepción para una aerolinea inválida', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'No existen aeropuertos asociados a esta aerolinea',
    );
  });

  it('updateAirportsFromAirline Debería actualizar los aeropuertos de una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alpha(3).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const result: AerolineaEntity = await service.updateAirportsFromAirline(
      aerolinea.id,
      [newAeropuerto],
    );

    expect(result).not.toBeNull();
    expect(result.aeropuertos).toHaveLength(1);
    expect(result.aeropuertos[0].id).toEqual(newAeropuerto.id);
  });

  it('updateAirportsFromAirline Debería lanzar una excepción para una aerolinea inválida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alpha(3).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(() =>
      service.updateAirportsFromAirline('0', [newAeropuerto]),
    ).rejects.toHaveProperty('message', 'Aerolinea no encontrada');
  });

  it('updateAirportsFromAirline Debería lanzar una excepción para un aeropuerto inválido', async () => {
    // Create an AeropuertoEntity object that is not persisted or has an invalid ID
    const invalidAeropuerto: AeropuertoEntity = {
      id: '00000000-0000-0000-0000-000000000000', // Use a non-existent UUID
      nombre: faker.company.name(),
      codigo: faker.string.alpha(3).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [], // Ensure all properties of AeropuertoEntity are present
    };

    await expect(() =>
      service.updateAirportsFromAirline(aerolinea.id, [invalidAeropuerto]),
    ).rejects.toHaveProperty('message', 'Aeropuerto no encontrado');
  });

  it('removeAirportFromAirline Debería eliminar un aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.removeAirportFromAirline(aerolinea.id, aeropuerto.id);
    const aerolineaStored: AerolineaEntity =
      await aerolineaRepository.findOneOrFail({
        where: { id: aerolinea.id },
        relations: ['aeropuertos'],
      });
    const deletedAeropuerto = aerolineaStored.aeropuertos.find(
      (a) => a.id === aeropuerto.id,
    );

    expect(deletedAeropuerto).toBeUndefined();
  });

  it('removeAirportFromAirline Debería lanzar una excepción para un aeropuerto inválido', async () => {
    await expect(() =>
      service.removeAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty('message', 'Aeropuerto no encontrado');
  });

  it('removeAirportFromAirline Debería lanzar una excepción para una aerolinea inválida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() =>
      service.removeAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty('message', 'Aerolinea no encontrada');
  });

  it('removeAirportFromAirline Debería lanzar una excepción para un aeropuerto no asociado a la aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alpha(3).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(() =>
      service.removeAirportFromAirline(aerolinea.id, newAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto no está asociado a la aerolinea',
    );
  });
});
