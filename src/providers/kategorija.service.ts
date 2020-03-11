import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kategorija } from '../models/kategorija';
import { retry } from 'rxjs/operators';
import { GlobalVars } from './globalVars';

@Injectable()
export class KategorijaService {

    constructor(private http: HttpClient, private globalVars: GlobalVars) { }

    getKategorije(): Observable<Kategorija[]> {
        const listaUrl = this.globalVars.baseURL + '/layers/kategorije';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                // tslint:disable-next-line:object-literal-key-quotes
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
            };
        return this.http.get<Kategorija[]>(listaUrl,  httpOptions)
            .pipe(retry(1));
    }
}
