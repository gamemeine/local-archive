// /src/web/src/app/shared/services/marker.service.ts
// Service for managing marker-related state and logic.

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor() { }

  // Default marker radius in meters
  radius = 20;
}