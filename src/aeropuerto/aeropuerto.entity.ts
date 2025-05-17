import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

@Entity('aeropuertos')
export class AeropuertoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToMany(() => AerolineaEntity, (aerolinea) => aerolinea.aeropuertos)
  aerolineas: AerolineaEntity[];
}
