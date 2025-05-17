import { AerolineaEntity } from '../../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [AerolineaEntity, AeropuertoEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity]),
];
