
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private apiUrl = 'https://api.unsplash.com/photos/';
  private clientId = 'zS7eHTGblqRKNdeQHoHV6ARDbTGECKRg2_wpW0tFNoM';

  constructor(private http: HttpClient) {}

  getPhotosBatch(page: number = 1, perPage: number = 10, orderBy: string = 'latest'): Observable<Photo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('order_by', orderBy);

    const url = `${this.apiUrl}?client_id=${this.clientId}`;
    return this.http.get<Photo[]>(url, { params }) || [];
  }
}