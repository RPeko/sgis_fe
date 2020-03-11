import { Layer } from './layer';

export class Kategorija {
  id: number;
  nadkateg: number;
  rbr: number;
  opis: string;
  layers: Layer[] = [];
  collapsed = false;
  subkat: Kategorija[] = [];
}
