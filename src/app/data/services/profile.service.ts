import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';
import { Pageble } from '../interfaces/pageble.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  me = signal<Profile | null>(null);

  getTestAccount() {
    return this.http.get<Profile[]>(
      'https://icherniakov.ru/yt-course/account/test_accounts'
    );
  }

  getMyProfile() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      tap((profile) => {
        this.me.set(profile);
      })
    );
  }

  getSubscribersShortList() {
    return this.http
      .get<Pageble<Profile>>(
        `https://icherniakov.ru/yt-course/account/subscribers/?page=1&size=50`
      )
      .pipe(map((res) => res.items.slice(0, 3)));
  }
}
