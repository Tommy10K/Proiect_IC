import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { DreamEntryService, DreamEntry } from '../services/dreamentry.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  showDetailModal = false;
  editingEntry: DreamEntry | null = null;
  editForm!: FormGroup;

  showTagSortModal = false;
  allTags: string[] = [];
  selectedTag: string = '';
  highlightedDates: Set<string> = new Set();

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

  openDetail(m: number, d: number): void {
    this.select(m, d);
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedDate = undefined;
    this.entries = [];
    this.cancelEdit();
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

  startEdit(entry: DreamEntry): void {
    this.editingEntry = entry;
    this.editForm = this.fb.group({
      title: [entry.title, [Validators.required, Validators.maxLength(255)]],
      description: [entry.description, Validators.maxLength(2000)],
      tags: [entry.tags.join(', '), Validators.maxLength(255)]
    });
  }

  cancelEdit(): void {
    this.editingEntry = null;
  }

  submitEdit(): void {
    if (!this.editingEntry || this.editForm.invalid) return;

    const { title, description, tags } = this.editForm.value;
    const tagArr = tags
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t);

    const dreamDate = this.editingEntry.dreamDate;

    this.entrySvc.updateDream(this.editingEntry.id!, {
      title,
      description,
      tags: tagArr,
      dreamDate
    }).subscribe({
      next: () => {
        this.message = 'Dream updated!';
        this.editingEntry = null;

        // 🟢 refresh entries inside the popup immediately
        this.entrySvc.getDay(dreamDate).subscribe({
          next: (updatedEntry) => {
            this.entries = [updatedEntry];
          }
        });

        // optional: refresh calendar too
        this.refreshYear();
      },
      error: () => {
        this.message = 'Error updating dream';
      }
    });
  }


  deleteDream(entry: DreamEntry): void {
    if (!entry.id) return;
    this.entrySvc.deleteDream(entry.id).subscribe({
      next: () => {
        this.message = 'Dream deleted!';
        this.cancelEdit();
        this.closeDetail();
        this.refreshYear();
      },
      error: () => {
        this.message = 'Error deleting dream';
      }
    });
  }

  openTagSort(): void {
    this.allTags = this.getAllTags();
    this.showTagSortModal = true;
  }

  closeTagSort(): void {
    this.showTagSortModal = false;
    this.selectedTag = '';
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    Object.values(this.map).forEach(entries => {
      entries.forEach(e => e.tags.forEach(t => tags.add(t)));
    });
    return Array.from(tags);
  }

  applyTagSort(): void {
    this.highlightedDates.clear();
    if (!this.selectedTag) return;
    Object.entries(this.map).forEach(([date, entries]) => {
      if (entries.some(e => e.tags.includes(this.selectedTag))) {
        this.highlightedDates.add(date);
      }
    });
    this.showTagSortModal = false;
  }

  clearTagSort(): void {
    this.highlightedDates.clear();
    this.selectedTag = '';
    this.showTagSortModal = false;
  }

  isTagHighlighted(m: number, d: number): boolean {
    return this.highlightedDates.has(this.iso(m, d));
  }

  private refreshYear(): void {
    this.entrySvc.getYear(this.year)
      .subscribe(m => {
        this.map = m;
        this.allTags = this.getAllTags();
      });
  }
}
