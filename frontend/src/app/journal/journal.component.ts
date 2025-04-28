import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { DreamEntryService } from '../services/dreamentry.service';
import { AuthService }       from '../services/auth.service';
import { Dream }             from '../models/dream.model';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  /* ---------- calendar ---------- */
  year   = 2025;
  months = Array.from({ length: 12 }, (_, i) => i);   // 0..11
  monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  map: Record<string, { interpretation: string; dreamDate: string }[]> = {};
  selectedDate?: string;
  entries: { interpretation: string; dreamDate: string }[] = [];

  /* ---------- form ---------- */
  dreamForm!: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private entrySvc: DreamEntryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    /* harta vise → calendar */
    this.refreshYear();

    /* reactive form init */
    this.dreamForm = this.fb.group({
      dreamDate:   ['', Validators.required],
      title:       ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(2000)]
    });
  }

  /* ---------- helpers calendar ---------- */
  pad = (m: number) => (new Date(this.year, m, 1).getDay() || 7);

  days = (m: number) =>
    Array.from(
      { length: new Date(this.year, m + 1, 0).getDate() },
      (_, i) => i + 1
    );

  iso = (m: number, d: number) =>
    new Date(this.year, m, d).toISOString().substring(0, 10);

  has = (m: number, d: number) => !!this.map[this.iso(m, d)];

  select(m: number, d: number): void {
    this.selectedDate = this.iso(m, d);
    this.entries      = this.map[this.selectedDate] || [];
  }

  /* ---------- submit ---------- */
  /* ---------- submit ---------- */
  onSubmit(): void {
    if (this.dreamForm.invalid) { return; }

    /* ⇣⇣⇣  payload nou – fără userId  ⇣⇣⇣ */
    const payload = {
      dreamDate:   this.dreamForm.value.dreamDate,
      title:       this.dreamForm.value.title,
      description: this.dreamForm.value.description
    };

    this.entrySvc.createDream(payload).subscribe({
      next: () => {
        this.message = 'Dream added!';
        this.dreamForm.reset({ dreamDate: '', title: '', description: '' });
        this.refreshYear();              // re-colorează calendarul
      },
      error: () => (this.message = 'Error adding dream')
    });
  }

  /* ---------- utils ---------- */
  private refreshYear(): void {
    this.entrySvc.getYear(this.year)
      .subscribe(map => (this.map = map));
  }
}
