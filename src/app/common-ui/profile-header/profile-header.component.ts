import { Component, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { NgIf } from '@angular/common';
import { ImgUrlPipe } from '../../data/utils/pipes/img-url.pipe';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [NgIf, ImgUrlPipe],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
}
