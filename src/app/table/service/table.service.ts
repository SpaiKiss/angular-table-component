import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel } from 'src/shared/data.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<DataModel[]> {
    return this.http.get<DataModel[]>('http://localhost:3000/items');
  }
}
