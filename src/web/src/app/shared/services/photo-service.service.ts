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

  getPhotosByIds(ids: string[]): void {
    const filtered = MockPhotos.filter((photo) => ids.includes(photo.id));
    this._filteredPhotos.next(filtered); // update the observable
  }

  // Optional: expose original data for other use cases
  getAllPhotos(): DataInstance[] {
    return MockPhotos;
  }
}
