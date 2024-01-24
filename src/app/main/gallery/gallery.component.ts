import { Component, HostListener, OnInit } from '@angular/core';
import { PhotoService } from './photos.service';
import { Photo } from '../models/photo.model';

enum DirectionType {
  DOWN = "DOWN",
  UP = "UP"
}

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  photos: Photo[] = [];
  page = 1;
  perPage = 20;
  orderBy = 'latest';
  isLoading = false;
  private dummyBatch: Photo[] = [];

  photoMap = new Map<number, number>();

  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.page = 1;
    this.perPage = 20;
    this.orderBy = 'latest';

    this.loadAndReplacePage(this.page, DirectionType.DOWN);
    this.loadAndReplacePage(this.page + 1, DirectionType.DOWN);
    this.page++;
  }

  visiblePages: number[] = [];
  private scrollInProgress = false;

  private loadAndReplacePage(page: number, dir: string): void {
   this.photoService
      .getPhotosBatch(page, this.perPage, this.orderBy)
      .subscribe(
        (photos: Photo[]) => {
          
          this.visiblePages.unshift(page);
          this.visiblePages.pop();

          const startIndex = (page - 2) * this.perPage;
          const endIndex = startIndex + this.perPage;
          
          const averageWidth =
            photos.reduce((sum, photo) => sum + photo.width, 0) / photos.length;
          this.dummyBatch = [...Array(this.perPage)].map(() => ({
            id: '',
            description: '',
            urls: { small: '' },
            width: averageWidth,
            height: this.photoMap.get(page) || 0,
            isVisible: true,
          }));

          if (dir === DirectionType.DOWN){ 
            if (this.page > 2) {
              this.photos.splice(0, this.perPage);
            }
            this.photos.push(...photos);
          } else {
            this.photos.splice(-this.perPage, this.perPage);
            this.photos = [...photos, ...this.photos];
          }

          this.updateImageVisibility();

          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching photos:', error);
          this.isLoading = false;
        }
      );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.scrollInProgress) {
      return;
    }
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollPosition >= documentHeight - 300 && !this.isLoading) {
      this.page++;
      this.isLoading = true;
      this.scrollInProgress = true;
      this.loadAndReplacePage(this.page, DirectionType.DOWN);
      this.debouncedScrollFinish();
    }

    if (window.scrollY === 0 && this.page > 2 && !this.isLoading) {
      this.page--;
      this.isLoading = true;
      this.scrollInProgress = true;
      this.loadAndReplacePage(this.page, DirectionType.UP);
      this.debouncedScrollFinish();
    }
  }

  private debouncedScrollFinish(): void {
    setTimeout(() => {
      this.scrollInProgress = false;
    }, 1000);
  }

  private updateImageVisibility(): void {
    
    this.photos.forEach((photo, i) => {
      if (i < Math.min(this.photos.length, 2 * this.perPage)) {
        photo.isVisible = true;
      } else {
        photo.isVisible = false;
      }
    });
  }
}
