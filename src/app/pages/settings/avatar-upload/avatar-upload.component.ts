import { Component, signal } from '@angular/core';
import { DndDirective } from '../../../common-ui/directives/dnd.directive';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [DndDirective],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/images/avatar-placeholder.png');

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    this.processFile(file);
  }

  onFileDrop(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    this.processFile(file);
  }

  processFile(file: File) {
    if (!file || !file.type.match('image.*')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.preview.set(e.target?.result?.toString() || '');
    };
    reader.readAsDataURL(file);

    this.avatar = file;
  }
}
