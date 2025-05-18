/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsUrl, IsDateString } from 'class-validator';
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
}
