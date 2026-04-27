import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return new HttpHeaders({
      Authorization: `Bearer ${currentUser?.token || ''}`
    });
  }

  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-order`, data, {
      headers: this.getAuthHeaders()
    });
  }

  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-payment`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getMyOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-orders`, {
      headers: this.getAuthHeaders()
    });
  }
}