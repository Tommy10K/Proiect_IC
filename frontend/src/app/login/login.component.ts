import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isSignupMode = false;
  loginData = { username: '', password: '' };
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
  }

  login(): void {
    if (this.isSignupMode) {
      if (this.loginData.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      this.authService.register(this.loginData).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          alert('Sign-up successful!');
          this.router.navigate(['/dashboard']); // ✅ redirect după sign-up
        },
        error: (err) => {
          alert('Sign-up failed.');
          console.error(err);
        }
      });
    } else {
      this.authService.login(this.loginData).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          alert('Login successful!');
          this.router.navigate(['/dashboard']); // ✅ redirect după login
        },
        error: (err) => {
          alert('Login failed.');
          console.error(err);
        }
      });
    }
  }
}
