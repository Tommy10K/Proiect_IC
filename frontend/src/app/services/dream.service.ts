import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ---------- tipuri ---------- */
export interface DreamInterpretRequest {
  title?: string;
  description: string;
  dreamDate?: string;          // yyyy-MM-dd (opţional)
}

export interface InterpretResponse {
  interpretation: string;
  dreamDate: string;
}

@Injectable({ providedIn: 'root' })
export class DreamService {
  private api = 'http://localhost:8080/api/dreams';

  constructor(private http: HttpClient) {}

  /* -------- doar interpretare (HOME) ------------ */
  interpretDream(text: string): Observable<InterpretResponse> {
    return this.http.post<InterpretResponse>(`${this.api}/interpret`, {
      dream: text
    });
  }

  /* ---------------- calendar -------------------- */
  getYear(year: number) {
    return this.http.get<Record<string, InterpretResponse[]>>(
      `${this.api}/year/${year}`
    );
  }

  /* ----- interpret & SAVE (DASHBOARD) ----------- */
  interpretAndSave(payload: DreamInterpretRequest): Observable<InterpretResponse> {
    return this.http.post<InterpretResponse>(
      `${this.api}/interpret-save`,
      payload
    );
  }
}
