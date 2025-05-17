import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Entity('aerolineas')
export class AerolineaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  // Relación con AeropuertoEntity
  @ManyToOne(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas)
  aeropuerto: AeropuertoEntity;
}
