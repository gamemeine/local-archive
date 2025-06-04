// /src/web/src/app/shared/intefaces/media.ts

import { CreationDate } from './creationDate';
import { Location } from './location';
import { Photo } from './photo';

export enum Privacy {
  Public = 'public',
  Private = 'private',
}

export interface Media {
  id: number;
  user_id: number;
  title: string;
  content?: string;
  description: string;
  privacy: Privacy;
  created_at: string;
  updated_at: string;
  photos: Photo[];
  location: Location;
  creation_date: CreationDate;
  city?: string;
}
