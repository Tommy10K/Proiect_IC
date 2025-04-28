// src/app/services/dreamentry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dream } from '../models/dream.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class DreamEntryService {

  private readonly API = 'http://localhost:8080/api/dreams';

  constructor(
    private http: HttpClient,
    private auth: AuthService            // 👈 injectăm token-provider
  ) {}

  /* ============== Create ================== */
  createDream(d: Dream) {
    return this.http.post<Dream>(this.API, d);
  }


  /* ============== Listă simplă pe user ==== */
  getUserDreams(userId: number) {
    const token = this.auth.getToken();
    return this.http.get<Dream[]>(`${this.API}/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  /* ============== Calendar ================ */
  getYear(year: number) {
    const token = this.auth.getToken();
    return this.http.get<
      Record<string, { interpretation: string; dreamDate: string }[]>
    >(`${this.API}/year/${year}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
}
