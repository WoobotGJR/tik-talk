import { Component, effect, inject, Pipe, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { catchError, of } from 'rxjs';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ProfileHeaderComponent, AvatarUploadComponent, AsyncPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  router = inject(Router);
  profileService = inject(ProfileService);

  errorMessage: string | null = null;

  form: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    username: FormControl<string>;
    description: FormControl<string>;
    skills: FormControl<string>;
  }>;

  @ViewChild(AvatarUploadComponent) avatarUpload!: AvatarUploadComponent;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
      lastName: [
        '',
        { validators: [Validators.required, Validators.minLength(6)] },
      ],
      username: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
      description: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
      skills: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
    }) as FormGroup<{
      firstName: FormControl<string>;
      lastName: FormControl<string>;
      username: FormControl<string>;
      description: FormControl<string>;
      skills: FormControl<string>;
    }>;

    effect(() => {
      this.form.patchValue({
        firstName: this.profileService.me()?.firstName,
        lastName: this.profileService.me()?.lastName,
        username: this.profileService.me()?.username,
        description: this.profileService.me()?.description,
        //@ts-ignore
        skills: this.profileService.me()?.stack,
      });
    });
  }

  onSave(e: Event) {
    e.preventDefault();
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (!this.form.valid) {
      return;
    }

    if (this.avatarUpload.avatar) {
      this.profileService.uploadAvatar(this.avatarUpload.avatar).pipe(
        //@ts-ignore
        catchError((error) => {
          this.errorMessage = error.message;
          console.log(this.errorMessage);
        })
      );
    }

    this.profileService.updateProfile(this.form.value).pipe(
      catchError((error) => {
        this.errorMessage = error.message;
        console.log(this.errorMessage);

        return of(null); // Возвращаем пустое значение, чтобы завершить поток
      })
    );
  }
}
