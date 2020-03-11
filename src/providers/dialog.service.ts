import { Injectable } from '@angular/core';
import { DialogLegendComponent } from 'src/app/dialog-legend/dialog-legend.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Layer } from 'src/models/layer';
import { DialogLayerPreviewComponent } from 'src/app/dialog-layer-preview/dialog-layer-preview.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog, protected storageMap: StorageMap) {

  }

  displayLegend(layer: Layer) {
    if (layer.legend) {
      try {
        const data = { title: layer.naziv + ':', simboli: JSON.parse(layer.legend) };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.position = {
          bottom: '0',
          right: '300'
        };
        dialogConfig.data = data;
        dialogConfig.width = '250px';
        dialogConfig.hasBackdrop = true;
        this.dialog.open(DialogLegendComponent, dialogConfig);
      } catch (e) {
      }
    }
  }

  displayLayerPreview(params: {layer: Layer, x, y}) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      left: (+params.x + 30) + 'px'
    };
    dialogConfig.data = params.layer;
    dialogConfig.width = '250px';
    dialogConfig.hasBackdrop = true;
    this.dialog.open(DialogLayerPreviewComponent, dialogConfig);
  }
}
