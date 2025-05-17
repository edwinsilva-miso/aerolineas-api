import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AeropuertoAerolineaModule } from './aeropuerto-aerolinea/aeropuerto-aerolinea.module';

@Module({
  imports: [AerolineaModule, AeropuertoModule, AeropuertoAerolineaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
