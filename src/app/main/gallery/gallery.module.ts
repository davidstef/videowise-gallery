import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryComponent } from './gallery.component';
import { PhotoService } from './photos.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        GalleryComponent
    ],
    providers: [PhotoService],
    exports: [ ],
    bootstrap: [GalleryComponent]
})
export class GalleryModule { }

