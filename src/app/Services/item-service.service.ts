import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITodoItem } from '../interface/interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export default class ItemServiceService {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getItem(): Observable<ITodoItem[]>{
    return this.http.get<ITodoItem[]>(this.API_URL);
  }

  // Update status
  updateStatus(idItem: number, statusItem: any){
    const urlApi = `${this.API_URL}/${idItem}`;
    return this.http.put<ITodoItem[]>(urlApi, statusItem);
  }

  // Update Item
  update(idItem: number, item: ITodoItem): Observable<ITodoItem>{
    const urlApi = `${this.API_URL}/${idItem}`;
    return this.http.put<ITodoItem>(urlApi, item);
  }

  deleteItem(itemId: number){
    const urlApi = `${this.API_URL}/${itemId}`;
    return this.http.delete(urlApi);
  }

  callInfo(id: number): Observable<ITodoItem>{
    const urlApi = `${this.API_URL}/${id}`;
    return this.http.get<ITodoItem>(urlApi);
  }

  addItem(item: any){
    return this.http.post(this.API_URL, item);
  }
}
