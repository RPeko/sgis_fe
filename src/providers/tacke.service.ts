import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tacka } from '../models/tacka';
import { retry } from 'rxjs/operators';
import { GlobalVars } from './globalVars';
import { KO } from 'src/models/ko';
import { Layer } from 'src/models/layer';

@Injectable()
export class TackeService {

    constructor(private http: HttpClient, private globalVars: GlobalVars) { }
    getListaTacaka(layer: Layer, ko: number): Observable<Tacka[]> {
        const listaUrl = this.globalVars.baseURL + '/layers/tacke';
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
        return this.http.get<Tacka[]>(listaUrl, httpOptions)
            .pipe(retry(1));
    }

    pripadaKO(tacka: Tacka, ko: KO) {
        let res = false;
        try {
            const rel = Math.abs(tacka.geom.coordinates[0] - ko.centarx) + Math.abs(tacka.geom.coordinates[1] - ko.centary);
            if (ko.idKO === 7) {
                if (rel && (rel < 0.08)) {
                    res = true;
                }
            } else {
                if (rel && rel < 0.04) {
                    res = true;
                }
            }
        } catch (e) {

        }
        return res;
    }
}
