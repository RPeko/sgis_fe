import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KO } from '../models/ko';
import { retry } from 'rxjs/operators';
import { GlobalVars } from './globalVars';


@Injectable()
export class KOService {

    constructor(private http: HttpClient, private globalVars: GlobalVars) { }

    getListaKO(): Observable<KO[]> {
        const listaKOUrl = this.globalVars.baseURL + '/api/listako';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                // tslint:disable-next-line:object-literal-key-quotes
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
            };

        return this.http.get<KO[]>(listaKOUrl,  httpOptions)
            .pipe(retry(1));
    }


    getKO(id: number): Observable<KO> {
        const KOUrl = this.globalVars.baseURL + '/api/ko';
        let params = new HttpParams();
        params = params.append('id', '' + id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                // tslint:disable-next-line:object-literal-key-quotes
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }),
            params:  new HttpParams().set('id', '' + id)
            };

        return this.http.get<KO>(KOUrl,  httpOptions)
        .pipe(retry(1));
    }
}
