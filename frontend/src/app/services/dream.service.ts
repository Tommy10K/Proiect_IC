import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DreamService {
  private api = 'http://localhost:8080/api/dreams';

  constructor(private http: HttpClient) {}

  // src/app/services/dream.service.ts
  interpretDream(text: string) {
    return this.http.post<{ interpretation: string; dreamDate: string }>(
      `${this.api}/interpret`,
      { dream: text }
    );
  }

  getYear(year: number) {                           // <= adaugă dacă lipsea
    return this.http.get<
      Record<string, { interpretation: string; dreamDate: string }[]>
    >(`${this.api}/year/${year}`);
  }
}
