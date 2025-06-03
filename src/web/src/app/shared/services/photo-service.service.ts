// /src/web/src/app/shared/services/photo-service.service.ts
// Service for managing and filtering photo data in the frontend.

import { Injectable } from '@angular/core';
import { MockPhotos } from '../mocks/mockPhotos';
import { DataInstance } from '../interfaces/dataInstance';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoServiceService {
  private _filteredPhotos = new BehaviorSubject<DataInstance[]>(MockPhotos); // initialize with all photos
  filteredPhotos$ = this._filteredPhotos.asObservable();

  constructor() {}

  // Filter photos by a list of IDs and update the observable
  getPhotosByIds(ids: string[]): void {
    const filtered = MockPhotos.filter((photo) => ids.includes(photo.id));
    this._filteredPhotos.next(filtered); // update the observable
  }

  // Expose all mock photos for other use cases
  getAllPhotos(): DataInstance[] {
    return MockPhotos;
  }
}