import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.css']
})
export class AddMediaComponent implements OnInit {
  productId: number = 0;
  selectedFiles: FileList | null = null;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');
    if (productIdParam) {
      this.productId = +productIdParam;
    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadMedia() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      console.error('No files selected');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }

    this.uploadInProgress = true;

    this.http.post(`http://localhost:8080/api/products/${this.productId}/add-media`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * event.loaded / (event.total ?? 1));
      } else if (event.type === HttpEventType.Response) {
        console.log('Media added successfully', event.body);
        this.uploadInProgress = false;
      }
    }, error => {
      console.error('Error adding media', error);
      this.uploadInProgress = false;
    });
  }
}
