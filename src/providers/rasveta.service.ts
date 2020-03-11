import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rasveta } from '../models/rasveta';
import { retry } from 'rxjs/operators';
import { GlobalVars } from './globalVars';
import { Layer } from 'src/models/layer';

@Injectable()
export class RasvetaService {

    constructor(private http: HttpClient, private globalVars: GlobalVars) { }
    getListaRasveteKO(layer: Layer, ko: number): Observable<Rasveta[]> {
        const listaUrl = this.globalVars.baseURL + '/rasveta/listarasvete';
        const searchstring: string[] = [];
        for (let i = 0; i < 3; i++) {
            if (layer && layer.filteri && layer.filteri[i] && layer.filteri[i].searchstring) {
                searchstring[i] = layer.filteri[i].searchstring;
            } else {
                searchstring[i] = '';
            }
        }

        const params = new HttpParams()
        .append('ko', '' + ko)
        .append('searchstring0', searchstring[0])
        .append('searchstring1', searchstring[1])
        .append('searchstring2', searchstring[2]);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }),
            params
            };
        return this.http.get<Rasveta[]>(listaUrl,  httpOptions)
             .pipe(retry(1));
    }

    icon(kol: number, zoom: number): string {
        if (kol == null || kol === 0) {
            if (zoom < 17) {
                return 'assets/icons/black_dot.png';
            } else {
                return 'assets/icons/stub_0.png';
            }
        } else {
            if (zoom < 17) {
                return 'assets/icons/yellow_dot.png';
            } else {
                switch (kol) {
                    case 1:
                        return 'assets/icons/stub_1.png';
                    case 2:
                        return 'assets/icons/stub_2.png';
                    case 3:
                        return 'assets/icons/stub_3.png';
                    case 4:
                        return 'assets/icons/stub_4.png';
                    default:
                        return 'assets/icons/stub_0.png';
                }
            }
        }
    }
}
