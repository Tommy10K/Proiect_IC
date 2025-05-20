import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Modelul receptor pentru un vis din jurnal */
export interface DreamEntry {
  id?:           number;
  title:         string | null;
  description:   string;
  interpretation:string;
  dreamDate:     string;   // "yyyy-MM-dd"
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class DreamEntryService {
  private readonly API = 'http://localhost:8080/api/dreams';

  constructor(private http: HttpClient) {}

  /** Salvează un vis nou (sau returnează 409 dacă există deja) */
  createDream(d: {
    dreamDate:   string;
    title:       string;
    description: string;
  }): Observable<any> {
    return this.http.post(`${this.API}`, d);
  }

  /** Listă simplă pe user (opțional) */
  getUserDreams(userId: number): Observable<DreamEntry[]> {
    return this.http.get<DreamEntry[]>(`${this.API}/user/${userId}`);
  }

  /** Harta anului: zi → array de interpretări */
  getYear(year: number): Observable<Record<string, DreamEntry[]>> {
    return this.http.get<Record<string, DreamEntry[]>>(
      `${this.API}/year/${year}`
    );
  }

  /** Aduce detaliile visului pentru o zi anume */
  getDay(date: string): Observable<DreamEntry> {
    return this.http.get<DreamEntry>(`${this.API}/date/${date}`);
  }
}