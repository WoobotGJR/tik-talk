import { Component, inject } from '@angular/core';
import { SvgComponent } from '../svg/svg.component';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FollowerCardComponent } from './follower-card/follower-card.component';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { IfStmt } from '@angular/compiler';
import { ImgUrlPipe } from '../../data/utils/pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgComponent,
    NgFor,
    FollowerCardComponent,
    RouterLink,
    AsyncPipe,
    JsonPipe,
    ImgUrlPipe,
    NgIf,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  profileService = inject(ProfileService);

  me = this.profileService.me;
  followers$ = this.profileService.getSubscribersShortList();

  menuItems = [
    {
      name: 'Home',
      icon: 'home',
      link: 'home',
    },
    {
      name: 'Chats',
      icon: 'chats',
      link: 'chats',
    },
    {
      name: 'Search',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMyProfile());
  }
}
