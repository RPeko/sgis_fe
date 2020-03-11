import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { GlobalVars } from './globalVars';
import { MLinija } from '../models/mlinija';
import { Layer } from 'src/models/layer';

@Injectable()
export class MLinijeService {
filterUlica = '';

    constructor(private http: HttpClient, private globalVars: GlobalVars) {

     }

    getListaMLinija(layer: Layer, ko: number): Observable<MLinija[]> {
        const listaUrl = this.globalVars.baseURL + '/layers/linije';
        const searchstring: string[] = [];
        for (let i = 0; i < 3; i++) {
            if (layer && layer.filteri && layer.filteri[i] && layer.filteri[i].searchstring) {
                searchstring[i] = layer.filteri[i].searchstring;
            } else {
                searchstring[i] = '';
            }
        }
        const params = new HttpParams()
        .append('layer', '' + layer.id)
        .append('ko', '' + ko)
        .append('searchstring0', searchstring[0])
        .append('searchstring1', searchstring[1])
        .append('searchstring2', searchstring[2]);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                // tslint:disable-next-line:object-literal-key-quotes
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }),
            params
            };
        return this.http.get<MLinija[]>(listaUrl,  httpOptions)
             .pipe(retry(1));
    }
}
