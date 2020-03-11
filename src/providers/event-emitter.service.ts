import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }

  KOChange = new EventEmitter();
  layerSwitch = new EventEmitter();
  layerPreviewChange = new EventEmitter();
}

