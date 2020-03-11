import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Layer } from 'src/models/layer';
import { EventEmitterService } from 'src/providers/event-emitter.service';

@Component({
  selector: 'app-dialog-layer-preview',
  templateUrl: './dialog-layer-preview.component.html',
  styleUrls: ['./dialog-layer-preview.component.scss']
})
export class DialogLayerPreviewComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogLayerPreviewComponent>,
               @Inject(MAT_DIALOG_DATA) public layer: Layer, public eventEmitter: EventEmitterService) { }

  ngOnInit() {
  }

  changedLayerPreview() {
     this.eventEmitter.layerPreviewChange.emit(this.layer);
  }

}
