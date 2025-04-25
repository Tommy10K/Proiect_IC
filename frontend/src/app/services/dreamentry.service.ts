import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dream } from '../models/dream.model';

@Injectable({ providedIn: 'root' })
export class DreamEntryService {
  private readonly API = 'http://localhost:8080/api/db/dreams';

  constructor(private http: HttpClient) {}

  createDream(d: Dream): Observable<Dream> {
    return this.http.post<Dream>(this.API, d);
  }

  // later, for listing:
  getUserDreams(userId: number) {
    return this.http.get<Dream[]>(`${this.API}/user/${userId}`);
  }
}
