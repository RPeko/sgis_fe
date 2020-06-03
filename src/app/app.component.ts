import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { KO } from 'src/models/ko';
import { MenuLayer } from 'src/models/menu_layer';
import { Layer } from 'src/models/layer';
import { Kategorija } from 'src/models/kategorija';
import { EventEmitterService } from 'src/providers/event-emitter.service';
import { KategorijaService } from 'src/providers/kategorija.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogService } from 'src/providers/dialog.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'GIS Srbobran';
  menuLayers: MenuLayer[] = [];
  listaKat: Kategorija[] = [];
  currentKO = ' (Srbobran)';

 listaKO: KO[] = [
    { idKO: 1,  nazivKO: 'Srbobran', rBrKO: 1, centarx: 45.548926, centary: 19.792946, zoom: 15 },
    { idKO: 2,  nazivKO: 'Turija', rBrKO: 2, centarx: 45.538982, centary: 19.857641, zoom: 15 },
    { idKO: 3,  nazivKO: 'Nadalj', rBrKO: 3, centarx: 45.509002, centary: 19.92212, zoom: 15 },
  ];


  constructor(
    public storageMap: StorageMap,
    public eventEmitter: EventEmitterService,
    private kategorijaService: KategorijaService,
    private ngxService: NgxUiLoaderService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.storageMap.get('srbKO').subscribe((katOpst: KO) => {
      if (katOpst) {
        this.eventEmitter.KOChange.emit(katOpst);
        this.currentKO = ' (' + katOpst.nazivKO + ')';
      }
      this.storageMap.get('srbMnLayers').subscribe((ls: MenuLayer[]) => {
        if (ls) {
          this.menuLayers = ls;
          // console.log('menuLayers: ' + JSON.stringify(this.menuLayers.length));
        } else {
          this.storageMap.delete('srbMnLayers').subscribe();
        }
        this.getListaKat();
      });
    });
  }

  getListaKat() {
    this.kategorijaService.getKategorije()
      .subscribe(lista => {
        //  console.log(JSON.stringify(lista));
        this.listaKat = [];
        lista.filter(kat => kat.nadkateg === 0)
          .forEach(item => this.listaKat.push(item));
        this.listaKat.forEach(kat => kat.subkat = []);
        lista.filter(kat => kat.nadkateg !== 0)
          .forEach(subkat => this.listaKat.find(kat => kat.id === subkat.nadkateg).subkat.push(subkat));
        this.checkFromStorage();
      },
        error => console.log('Nema konekcije!  ' + error));
  }

  promeniKO(katOpst: KO) {
    this.storageMap.set('srbKO', katOpst).subscribe();
    this.eventEmitter.KOChange.emit(katOpst);
    this.currentKO = ' (' + katOpst.nazivKO + ')';
    this.menuLayers.forEach(cl => {
      const layer = this.getLayer(cl.id);
      if (cl.checked && layer.pojedinacnaKO) {
        this.reloadLayer(layer);
      }
    });
  }

  getLayer(id: number) {
    let layer: Layer;
    this.listaKat.forEach(kat => {
      if (kat.layers.findIndex(l => l.id === id) > -1) {
        layer = kat.layers.find(l => l.id === id);
        console.log(JSON.stringify(layer));
      } else {
        kat.subkat.forEach(extSubkat => {
          if (extSubkat.layers.findIndex(l => l.id === id) > -1) {
            layer = extSubkat.layers.find(l => l.id === id);
          }
        });
      }
    });
    return layer;
  }


  checkFromStorage() {
    this.listaKat.forEach(kat => kat.subkat.forEach(subkat => this.checkFromStorageSubkat(subkat)));
    this.listaKat.forEach(kat => this.checkFromStorageKat(kat));
  }

  checkFromStorageSubkat(subkat: Kategorija) {
    subkat.collapsed = true;
    subkat.layers.forEach(l => {
      const cl = this.menuLayers.find((mlayer: MenuLayer) => mlayer.id === l.id);
      if (cl) {
        l.checked = cl.checked;
        if (l.checked) {
          subkat.collapsed = false;
        }
      } else {
        l.checked = false;
        this.menuLayers.push({ id: l.id, checked: false });
      }
      if (l.checked) {
        if (l.id === 4) {
          this.ngxService.startLoader('rasveta');
        } else {
          this.ngxService.start();
        }
      }
      this.eventEmitter.layerSwitch.emit(l);
    });
  }

  checkFromStorageKat(kat: Kategorija) {
    kat.collapsed = true;
    kat.layers.forEach(l => {
      const cl = this.menuLayers.find((mlayer: MenuLayer) => mlayer.id === l.id);
      if (cl) {
        l.checked = cl.checked;
        if (l.checked) {
          kat.collapsed = false;
        }
      } else {
        l.checked = false;
        this.menuLayers.push({ id: l.id, checked: false });
      }
      if (l.checked) {
        if (l.id === 4) {
          this.ngxService.startLoader('rasveta');
        } else {
          this.ngxService.start();
        }
      }
      this.eventEmitter.layerSwitch.emit(l);
    });
    kat.subkat.forEach(subkat => {
      if (!subkat.collapsed) {
        kat.collapsed = false;
      }
    });
  }

  toggleCollapsed(kat: Kategorija) {
    if (kat.collapsed) {
      kat.collapsed = false;
    } else {
      kat.collapsed = true;
    }
  }

  reloadLayer(layer: Layer) {
    layer.checked = false;
    this.eventEmitter.layerSwitch.emit(layer);
    layer.checked = true;
    this.eventEmitter.layerSwitch.emit(layer);
  }

  clickLayer(layer: Layer, preserveFitToBounds?: boolean) {
    // console.log("layer: " + JSON.stringify(layer));
    if (layer.id === 4) {
      this.ngxService.startLoader('rasveta');
    } else {
      this.ngxService.start();
    }
    layer.checked = !layer.checked;
    if (layer.checked === false && layer.filteri) {
      layer.filteri.forEach(f => f.searchstring = '');
    }
    if (preserveFitToBounds) {
      layer.preserveFitToBounds = true;
    } else {
      layer.preserveFitToBounds = false;
    }
    // console.log('layer.checked:  ' + layer.checked);
    if (!this.menuLayers) {
      this.removeAllLayers();
    }
    const ml = this.menuLayers.find((mlayer: MenuLayer) => mlayer.id === layer.id);
    // console.log(JSON.stringify(cl));
    if (ml) {
      ml.checked = layer.checked;
    }
    this.eventEmitter.layerSwitch.emit(layer);
    this.storageMap.set('srbMnLayers', this.menuLayers).subscribe();
  }

  checkAll(kat: Kategorija) {
    const listUnchecked = kat.layers.filter(l => l.checked === false);
    switch (listUnchecked.length) {
      case 0:
        kat.layers.forEach(l => {
          this.clickLayer(l);
        });
        break;
      case 1:
        listUnchecked.forEach(l => {
          this.clickLayer(l);  // if exist one uncheck, fit to bounds
        });
        break;
      default:
        listUnchecked.forEach(l => {
          this.clickLayer(l, true);  // if exist more than one, not fit to bounds
        });
    }
  }

  removeAllLayers() {
    this.menuLayers.forEach(ml => ml.checked = false);
    this.storageMap.set('srbMnLayers', this.menuLayers).subscribe();
    this.listaKat.forEach(kat => kat.layers.forEach(l => l.filteri.forEach(f => f.searchstring = '')));
    this.listaKat.forEach(kat => kat.subkat.forEach(sk => sk.layers.forEach(l => l.filteri.forEach(f => f.searchstring = ''))));
    this.checkFromStorage();
  }

  changeLayerPreview(ev, layer: Layer) {
    const x = +ev.clientX;
    const y = +ev.clientY;
    this.dialogService.displayLayerPreview({ layer, x, y });
  }

  displayLegend(l: Layer) {
    this.dialogService.displayLegend(l);
  }

}
