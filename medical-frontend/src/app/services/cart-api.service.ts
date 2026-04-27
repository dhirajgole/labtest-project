import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private baseUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser?.token || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getMyCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, {
      headers: this.getHeaders()
    });
  }

  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, item, {
      headers: this.getHeaders()
    });
  }

  updateCart(itemId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${itemId}`, { quantity }, {
      headers: this.getHeaders()
    });
  }

  removeFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${itemId}`, {
      headers: this.getHeaders()
    });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`, {
      headers: this.getHeaders()
    });
  }
}