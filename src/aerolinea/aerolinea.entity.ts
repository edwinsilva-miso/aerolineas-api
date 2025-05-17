import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';

@Entity('aerolineas')
export class AerolineaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fechaFundacion: string;

  @Column()
  paginaWeb: Date;

  // Relación con AeropuertoEntity
  @ManyToOne(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas)
  aeropuerto: AeropuertoEntity;
}
