import { FormBuilder } from '@angular/forms';
import { Component, OnDestroy, inject } from '@angular/core';
import { ProfileService } from '../../../data/services/profile.service';
import {
  Subscriber,
  Subscription,
  debounce,
  debounceTime,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  profileService = inject(ProfileService);

  searchFormSubscription: Subscription = new Subscription();
  form: any;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      firstName: [''],
      lastName: [''],
      stack: [''],
    });

    this.searchFormSubscription = this.form.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        //@ts-ignore
        switchMap((data) => this.profileService.filterProfiles(data)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.form.reset();
    this.searchFormSubscription.unsubscribe();
  }
}
