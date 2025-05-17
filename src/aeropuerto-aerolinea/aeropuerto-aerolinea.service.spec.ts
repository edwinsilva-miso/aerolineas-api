import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoAerolineaService,
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useClass: Repository, // Or useValue: jest.fn() for a simpler mock
        },
        {
          provide: getRepositoryToken(AerolineaEntity),
          useClass: Repository, // Or useValue: jest.fn() for a simpler mock
        },
      ],
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
