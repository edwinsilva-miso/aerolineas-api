import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';

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

  // Relación con AerolineaEntity
  @OneToMany(() => AerolineaEntity, aeropuerto => aeropuerto.aerolinea)
  aerolineas: AerolineaEntity[];
}
