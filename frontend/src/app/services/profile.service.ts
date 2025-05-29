// src/app/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDreamProfileDTO {
  emotionalTone: number;
  rationalityCreativity: number;
  socialOrientation: number;
  activityLevel: number;
  controlLevel: number;
}

export interface ProfileMatchDTO {
  name: string;
  similarity: number; // 0.0–1.0
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): Observable<UserDreamProfileDTO> {
    return this.http.get<UserDreamProfileDTO>(`${this.api}/user/${userId}`);
  }

  getUserMatches(userId: number): Observable<ProfileMatchDTO[]> {
    return this.http.get<ProfileMatchDTO[]>(`${this.api}/match/user/${userId}`);
  }
}
