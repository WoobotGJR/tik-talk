import { NgIf } from '@angular/common';
import { AuthService } from '../../data/services/auth/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // Импортируем ReactiveFormsModule
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  errorMessage: string | null = null;

  form: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
      password: [
        '',
        { validators: [Validators.required, Validators.minLength(6)] },
      ],
    }) as FormGroup<{
      username: FormControl<string>;
      password: FormControl<string>;
    }>;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();
      this.authService
        .login(rawValue)
        .pipe(
          catchError((error) => {
            this.errorMessage = error.message;
            console.log(error);

            return of(null); // Возвращаем пустое значение, чтобы завершить поток
          })
        )
        .subscribe((res) => {
          this.router.navigate(['']);
        });
    }
  }
}
