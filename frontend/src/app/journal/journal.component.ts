import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DreamService } from '../services/dream.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dream Journal 2025</h2>
    <div class="grid">
      <div *ngFor="let day of days"
           [class.has]="has(day)"
           (click)="select(day)">
        {{ day.getDate() }}
      </div>
    </div>

    <h3 *ngIf="entries.length">Vis(e) pe {{ sel | date:'longDate' }}</h3>
    <ul>
      <li *ngFor="let e of entries">{{ e.interpretation }}</li>
    </ul>
  `,
  styles:[`
    .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:.25rem;margin-bottom:1rem}
    .grid div{width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;border:1px solid #ddd;cursor:pointer}
    .grid div.has{background:#b2e6b2}
  `]
})
export class JournalComponent implements OnInit {
  days: Date[] = [];
  map: Record<string, {interpretation:string; dreamDate:string}[]> = {};
  sel?: string;
  entries: any[] = [];

  constructor(private svc: DreamService) {}

  ngOnInit() {
    for (let d=new Date('2025-01-01'); d<=new Date('2025-12-31'); d.setDate(d.getDate()+1))
      this.days.push(new Date(d));

this.svc.getYear(2025).subscribe((mapData) => this.map = mapData);
  }
  has(day: Date) {
    return this.map[this.iso(day)];
  }
  select(day: Date) {
    this.sel = this.iso(day);
    this.entries = this.map[this.sel] || [];
  }
  private iso(d: Date){ return d.toISOString().substring(0,10); }
}
