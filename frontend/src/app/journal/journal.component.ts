import { Component, OnInit }     from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { RouterModule }           from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router } from '@angular/router';
import { DreamEntryService } from '../services/dreamentry.service';
import { Dream }                 from '../models/dream.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService }        from '../services/auth.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  dreamForm!: FormGroup;
 
  currentUserId: number | null = null;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dreamService: DreamEntryService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.currentUserId = this.auth.getUserId();
    console.log('▶ currentUserId =', this.currentUserId);

    this.dreamForm = this.fb.group({
      dreamDate: ['', Validators.required],
      title:     ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(2000)]
    });
  }

  onSubmit() {
    console.log('↪ onSubmit fired, form=', this.dreamForm.value, 'userId=', this.currentUserId);
    if (this.dreamForm.invalid) return;

    const payload: Dream = {
      userId: this.currentUserId,
      ...this.dreamForm.value
    };

    this.dreamService.createDream(payload).subscribe({
      next: created => {
        console.log('Saved dream', created);
        // reset with empty strings so the inputs clear
        this.dreamForm.reset({
          dreamDate:   '',
          title:       '',
          description: ''
        });
        this.message = 'Dream added successfully!';
      },
      error: err => {
        console.error('Create failed', err);
        this.message = 'Error adding dream';
      }
    });
  }
}
