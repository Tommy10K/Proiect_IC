import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DreamService {
  private apiUrl = 'http://localhost:8080/api/dreams/interpret';

  constructor(private http: HttpClient) {}

  interpretDream(dreamText: string): Observable<string> {
    return this.http.post(this.apiUrl, { dream: dreamText }, { responseType: 'text' });
  }
}
