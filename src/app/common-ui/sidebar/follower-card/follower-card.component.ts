import { Component, Input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../../data/utils/pipes/img-url.pipe';

@Component({
  selector: 'app-follower-card',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './follower-card.component.html',
  styleUrl: './follower-card.component.scss',
})
export class FollowerCardComponent {
  @Input() profile!: Profile;
}
