import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { DreamEntryService, DreamEntry } from '../services/dreamentry.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  year         = new Date().getFullYear();
  months       = Array.from({ length: 12 }, (_, i) => i);
  monthNames   = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  map: Record<string, DreamEntry[]> = {};
  selectedDate?: string;
  entries: DreamEntry[] = [];

  dreamForm!: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private entrySvc: DreamEntryService
  ) {}

  ngOnInit(): void {
    this.refreshYear();

    this.dreamForm = this.fb.group({
      dreamDate:   ['', Validators.required],
      title:       ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(2000)]
    });
  }

  /** calendar helpers */
  pad = (m: number) => (new Date(this.year, m, 1).getDay() || 7);
  days = (m: number) =>
    Array.from({ length: new Date(this.year, m + 1, 0).getDate() }, (_, i) => i + 1);

  /** Format date as yyyy-MM-dd without timezone issues */
  iso = (m: number, d: number): string => {
    const month = (m + 1).toString().padStart(2, '0');
    const day   = d.toString().padStart(2, '0');
    return `${this.year}-${month}-${day}`;
  };

  has = (m: number, d: number) =>
    !!this.map[this.iso(m, d)];

  /** click pe zi: aduce datele visului */
  select(m: number, d: number): void {
    this.selectedDate = this.iso(m, d);
    this.entrySvc.getDay(this.selectedDate!).subscribe({
      next: e => this.entries = [e],
      error: () => this.entries = []
    });
  }

  /** submit formular */
  onSubmit(): void {
    if (this.dreamForm.invalid) return;

    const { dreamDate, title, description } = this.dreamForm.value;
    const payload = { dreamDate, title, description };

    this.entrySvc.createDream(payload).subscribe({
      next: () => {
        this.message = 'Dream added!';
        this.dreamForm.reset({ dreamDate:'', title:'', description:'' });
        this.refreshYear();
      },
      error: err => {
        this.message = err.status === 409
          ? err.error
          : 'Error adding dream';
      }
    });
  }

  private refreshYear(): void {
    this.entrySvc.getYear(this.year)
      .subscribe(m => this.map = m);
  }
}
