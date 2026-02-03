import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-uploader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent {
    @Input() multiple = true;
    @Input() existingImages: any[] = [];
    @Output() imagesSelected = new EventEmitter<File[]>();
    @Output() imageDeleted = new EventEmitter<number>();

    selectedFiles: File[] = [];
    previews: string[] = [];

    onFilesSelected(event: any): void {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.selectedFiles.push(file);

                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.previews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
            this.imagesSelected.emit(this.selectedFiles);
        }
    }

    removeNewImage(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.previews.splice(index, 1);
        this.imagesSelected.emit(this.selectedFiles);
    }

    removeExistingImage(imageId: number): void {
        this.imageDeleted.emit(imageId);
    }
}
