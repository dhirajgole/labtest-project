import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient) {}

  sendMessage(message: string){

    const token = localStorage.getItem('token');

    return this.http.post(
      'http://localhost:3000/chatbot',
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}