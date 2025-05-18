/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsArray,
  IsDateString,
} from 'class-validator';
export class AreolineaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFundacion: Date;

  @IsNotEmpty()
  @IsUrl()
  paginaWeb: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  aeropuertos: string[];
}
