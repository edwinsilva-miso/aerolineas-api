import { Module } from '@nestjs/common';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity])],
  providers: [AeropuertoAerolineaService],
})
export class AeropuertoAerolineaModule {}
