import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-easyprint';
import { KO } from 'src/models/ko';
import { LmmTackaLayera } from 'src/models/lmm_tacka_layera';
import { LmlLinijaLayera } from 'src/models/lml_linija_layera';
import { LmpPoligonLayera } from 'src/models/lmp_poligon_layera';
import { EventEmitterService } from 'src/providers/event-emitter.service';
import { Tacka } from 'src/models/tacka';
import { Linija } from 'src/models/linija';
import { Poligon } from 'src/models/poligon';
import { Rasveta } from 'src/models/rasveta';
import { TackeService } from 'src/providers/tacke.service';
import { MLinijeService } from 'src/providers/mlinije.service';
import { PoligoniService } from 'src/providers/poligoni.service';
import { RasvetaService } from 'src/providers/rasveta.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogDetailsComponent } from '../dialog-details/dialog-details.component';
import { DialogService } from 'src/providers/dialog.service';
import { LinijeService } from 'src/providers/linije.service';
import { Layer } from 'src/models/layer';



@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})


export class MapaComponent implements OnInit {
  mymap: L.Map;
  selectedIdKO = 7;
  KO: KO = { idKO: 1,  nazivKO: 'Srbobran', rBrKO: 1, centarx: 45.548926, centary: 19.792946, zoom: 15 };
  listaKO: KO[];
  layers: Array<Layer> = [];
  errorMessage: string;
  listaLmmTackaLayera: LmmTackaLayera[] = new Array<LmmTackaLayera>();
  listaLmlLinijaLayera: LmlLinijaLayera[] = new Array<LmlLinijaLayera>();
  listaLmpPoligonLayera: LmpPoligonLayera[] = new Array<LmpPoligonLayera>();
  rasvetaMarkers = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  loadedLayers: number[] = [];
  baseLayerControl: L.Control;
  baseMaps =
    {
      'Open street':
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
          {
            // tslint:disable-next-line:max-line-length
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativeclmmons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicnBla28iLCJhIjoiY2prYXNvemtoMDBxMTNxcWYxY29lY3FndSJ9.6m8S5UFtwcWOE1e84569jQ'
          }),
      'Esri Topo':
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          {
            // tslint:disable-next-line:max-line-length
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          }),
      'Esri World Imaginary':
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            // tslint:disable-next-line:max-line-length
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          }),
      'Bez osnovne mape':
        L.tileLayer('')
    };

  constructor(
    private eventEmitter: EventEmitterService,
    private ngxService: NgxUiLoaderService,
    private tackeService: TackeService,
    private linijeService: LinijeService,
    private mlinijeService: MLinijeService,
    private poligoniService: PoligoniService,
    private rasvetaService: RasvetaService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.mymap = L.map('lmapa', { zoomSnap: 0.2, zoomControl: false })
      .setView(L.latLng(this.KO.centarx, this.KO.centary), this.KO.zoom);
    this.baseMaps['Open street'].addTo(this.mymap);
    this.eventEmitter.KOChange.subscribe((ko: KO) => {
      // console.log(JSON.stringify(ko));
      this.KO = ko;
      this.mymap.panTo(L.latLng(ko.centarx, ko.centary));
      this.mymap.setZoom(ko.zoom);
    });
    this.eventEmitter.layerSwitch.subscribe((layer: Layer) => {
      // console.log("Loading layer: " + JSON.stringify(layer));
      if (layer.checked) {
        // console.log(JSON.stringify(layer.filteri));
        this.loadLayer(layer);
      } else {
        // console.log("Unloading layer: " + layer.id + " , vrsta: " + layer.vrsta);
        this.unloadLayer(layer);
      }
    });
    this.eventEmitter.layerPreviewChange.subscribe((layer: Layer) => {
      this.changedLayerPreview(layer);
    });
    this.baseLayerControl = L.control.layers(this.baseMaps, {}).addTo(this.mymap);
    L.control.zoom({
      position: 'topright'
    }).addTo(this.mymap);
    L.easyPrint({
      title: 'Štampanje',
      position: 'topright',
      sizeModes: ['A4Portrait', 'A4Landscape']
  }).addTo(this.mymap);
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// Layers //////////////////////////////////////////////////////////////////////////////////////

  loadLayer(layer: Layer) {
    switch (layer.vrsta) {
      case 't':
      case 'T':
        this.getTacke(layer);
        break;
      case 'p':
      case 'P':
        this.getPoligoni(layer);
        break;
      case 'l':
      case 'L':
        this.getMLinije(layer);
        break;
      case 'r':
      case 'R':
        this.getRasveta(layer);
        break;
    }
  }

  unloadLayer(layer: Layer) {
    switch (layer.vrsta) {
      case 't':
      case 'T':
        this.listaLmmTackaLayera.forEach((tl, index) => {
          if (tl.layerId === layer.id) {
            tl.lmm.forEach(m => m.removeFrom(this.mymap));
            this.listaLmmTackaLayera.splice(index, 1);
            this.ngxService.stop();
          }
        });
        break;
      case 'p':
      case 'P':
        this.listaLmpPoligonLayera.forEach((pl, index) => {
          if (pl.layerId === layer.id) {
            pl.lmp.forEach(p => p.removeFrom(this.mymap));
            this.listaLmpPoligonLayera.splice(index, 1);
            this.ngxService.stop();
          }
        });
        break;
      case 'l':
      case 'L':
        this.listaLmlLinijaLayera.forEach((ll, index) => {
          if (ll.layerId === layer.id) {
            ll.lml.forEach(l => l.removeFrom(this.mymap));
            this.listaLmlLinijaLayera.splice(index, 1);
            this.ngxService.stop();
          }
        });
        break;
      case 'r':
      case 'R':
        this.rasvetaMarkers.clearLayers();
        this.rasvetaMarkers.removeFrom(this.mymap);
        this.ngxService.stopLoader('rasveta');
        break;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  ////// Tacke //////////////////////////////////////////////////////////////////////////////////////
  getTacke(layer: Layer) {
    const lmmTackaLayera = new LmmTackaLayera();
    const lmmZaKO = [] as L.Marker[];
    lmmTackaLayera.layerId = layer.id;
    this.tackeService.getListaTacaka(layer, this.KO.idKO).subscribe(
      lista => {
        if (lista) {
          lista.forEach(tacka => {
            const lmmTacka = this.lmm(tacka);
            lmmTackaLayera.lmm.push(lmmTacka);
            if (!layer.preserveFitToBounds && this.tackeService.pripadaKO(tacka, this.KO)) {
              lmmZaKO.push(lmmTacka);
            }
          }
          );
        }
        this.listaLmmTackaLayera.push(lmmTackaLayera);
        layer.checked = true;
        this.ngxService.stop();
        if (!layer.preserveFitToBounds && lmmZaKO.length > 0) {
          const fg = new L.featureGroup(lmmZaKO);
          const bounds = fg.getBounds() as L.bounds;
          this.mymap.flyToBounds(bounds, { padding: [15, 15] });
        }
      });
  }

  lmm(tacka: Tacka) {
    const lmm = L.marker([tacka.geom.coordinates[0], tacka.geom.coordinates[1]])
      .setIcon(L.icon({ iconUrl: tacka.icon, iconSize: [16, 16], iconAnchor: [8, 16] })).addTo(this.mymap);
    const divElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerHTML = tacka.info;
    pElement.innerHTML += '<br\>';
    pElement.innerHTML += '<br\>';

    if (tacka.detalji && tacka.detalji !== null) {
      const bElement = document.createElement('button');
      bElement.id = 'popup_button';
      bElement.addEventListener('click',
        () =>
          this.dialogService.dialog.open(DialogDetailsComponent, {
            // width: '250px',
            data: tacka.detalji
          })
      );
      bElement.innerHTML = 'Detaljno';
      pElement.appendChild(bElement);
    }
    divElement.appendChild(pElement);
    lmm.bindPopup(divElement);
    if (tacka.label) {
      lmm.bindTooltip(tacka.label, { permanent: true, direction: 'right',  opacity: '0.3', className: 'label' });
    } else {
      lmm.bindTooltip(tacka.tooltip, { opacity: 0.7 });
    }
    return lmm;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// MLinije //////////////////////////////////////////////////////////////////////////////////////
  getMLinije(layer: Layer) {
    const lmlLinijaLayera = new LmlLinijaLayera();
    const lmlZaKO = [] as L.Polyline[];
    lmlLinijaLayera.layerId = layer.id;
    this.mlinijeService.getListaMLinija(layer, this.KO.idKO).subscribe(
      lista => {
        if (lista) {
          lista.forEach(mlinija => {
            for (const coord of mlinija.geom.coordinates) {
              const linija = new Linija();
              linija.coordinates = coord;
              linija.strokeColor = mlinija.strokeColor;
              linija.strokeOpacity = mlinija.strokeOpacity;
              linija.strokeWeight = mlinija.strokeWeight;
              linija.opis = mlinija.opis;
              linija.info = mlinija.info;
              const lmlMlinija = this.lml(linija) as L.Polyline;
              lmlLinijaLayera.lml.push(lmlMlinija);
              lmlZaKO.push(lmlMlinija);
              // if (!layer.preserveFitToBounds && this.linijeService.pripadaKO(linija, this.KO)) {
              //   lmlZaKO.push(lmlMlinija);
              // }
            }
          });
        }
        this.listaLmlLinijaLayera.push(lmlLinijaLayera);
        layer.checked = true;
        this.ngxService.stop();
        if (!layer.preserveFitToBounds && lmlZaKO.length > 0) {
          const fg = new L.featureGroup(lmlZaKO);
          const bounds = fg.getBounds() as L.bounds;
          this.mymap.flyToBounds(bounds, { padding: [15, 15] });
        }
      });

  }

  lml(linija: Linija) {
    let path: L.LatLng[] = new Array<L.LatLng>();
    for (const coord of linija.coordinates) {
      path.push(new L.LatLng(coord[0], coord[1]));
    }
    const lml = L.polyline(path);
    if (linija.label) {
      lml.bindTooltip(linija.label, { permanent: true, direction: 'center', opacity: '0.3', className: 'label' });
    } else {
      lml.bindTooltip(linija.opis);
    }
    lml.setStyle({
      color: linija.strokeColor,
      opacity: linija.strokeOpacity,
      weight: linija.strokeWeight
    }).addTo(this.mymap);
    const divElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerHTML = linija.info;
    pElement.innerHTML += '<br\>';
    pElement.innerHTML += '<br\>';

    if (linija.detalji && linija.detalji !== null) {
      const bElement = document.createElement('button');
      bElement.id = 'popup_button';
      bElement.addEventListener('click',
        () =>
          this.dialogService.dialog.open(DialogDetailsComponent, {
            // width: '250px',
            data: linija.detalji
          })
      );
      bElement.innerHTML = 'Detaljno';
      pElement.appendChild(bElement);
    }
    divElement.appendChild(pElement);
    lml.bindPopup(divElement);
    path = [];
    return lml;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// Poligoni //////////////////////////////////////////////////////////////////////////////////////
  getPoligoni(layer: Layer) {
    const lmpPoligonLayera = new LmpPoligonLayera();
    lmpPoligonLayera.layerId = layer.id;
    const lmpZaKO = [] as L.Polygon[];
    this.poligoniService.getListaPoligona(layer, this.KO.idKO).subscribe(
      lista => {
        if (lista) {
          lista.forEach(poligon => {
            const lmpPoligon = this.lmp(poligon) as L.Polygon;
            lmpPoligonLayera.lmp.push(lmpPoligon);
            if (!layer.preserveFitToBounds && this.poligoniService.pripadaKO(poligon, this.KO)) {
              lmpZaKO.push(lmpPoligon);
            }
          });
        }
        this.listaLmpPoligonLayera.push(lmpPoligonLayera);
        layer.checked = true;
        this.ngxService.stop();
        if (!layer.preserveFitToBounds && lmpZaKO.length > 0) {
          const fg = new L.featureGroup(lmpZaKO);
          const bounds = fg.getBounds() as L.bounds;
          this.mymap.flyToBounds(bounds, { padding: [15, 15], maxZoom: 17 });
        }
      });
  }

  lmp(poligon: Poligon) {
    let temena: L.LatLng[] = new Array<L.LatLng>();
    let paths: L.LatLng[][] = new Array<L.LatLng[]>();
    for (let i = 0; i < poligon.geom.coordinates.length; i++) {
      poligon.geom.coordinates[+i].forEach(koord => {
        temena.push(new L.LatLng(koord[0], koord[1]));
      });
      paths.push(temena);
      temena = [];
    }
    const lmp = L.polygon(paths);
    if (poligon.label) {
      lmp.bindTooltip(poligon.label, { permanent: true, direction: 'center', opacity: '0.3', className: 'label' });
    }
    lmp.setStyle({
      color: poligon.strokeColor,
      opacity: poligon.strokeOpacity,
      weight: poligon.strokeWeight,
      fillColor: poligon.fillColor,
      fillOpacity: poligon.fillOpacity
    }).addTo(this.mymap);
    const divElement = document.createElement('div');

    const pElement = document.createElement('p');
    pElement.innerHTML = poligon.info;
    pElement.innerHTML += '<br\>';
    pElement.innerHTML += '<br\>';

    if (poligon.detalji && poligon.detalji !== null) {
      const bElement = document.createElement('button');
      bElement.id = 'popup_button';
      bElement.addEventListener('click',
        () =>
          this.dialogService.dialog.open(DialogDetailsComponent, {
            // width: '250px',
            data: poligon.detalji
          })
      );
      bElement.innerHTML = 'Detaljno';
      pElement.appendChild(bElement);
    }
    divElement.appendChild(pElement);
    lmp.bindPopup(divElement);
    paths = [];

    return lmp;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// Rasveta //////////////////////////////////////////////////////////////////////////////////////
  getRasveta(layer: Layer) {
    this.rasvetaService.getListaRasveteKO(layer, this.KO.idKO).subscribe(
      listarasvete => {
        this.removeRasveta();
        listarasvete.forEach(stub => this.dodajRasvetaMarkerNaMapu(stub));
        this.rasvetaMarkers.addTo(this.mymap);
        this.ngxService.stopLoader('rasveta');
      });
  }

  dodajRasvetaMarkerNaMapu(rasveta: Rasveta) {
    const markerLatLng = new L.LatLng(rasveta.geom.coordinates[0], rasveta.geom.coordinates[1]);
    let info: string;
    let snaga: string;
    const marker = L.marker(markerLatLng)
      .setIcon(L.icon({ iconUrl: this.rasvetaService.icon(rasveta.kolicina, 18) }));
    if (rasveta.kolicina !== null) {
      if (rasveta.snaga1 !== null) {
        snaga = '' + rasveta.snaga1;
        if (rasveta.snaga2 !== null) {
          snaga = snaga + '+' + rasveta.snaga2;
          if (rasveta.snaga3 !== null) {
            snaga = snaga + '+' + rasveta.snaga3;
            if (rasveta.snaga4 !== null) {
              snaga = snaga + '+' + rasveta.snaga4;
            }
          }
        }
      }
      // tslint:disable-next-line:max-line-length
      info = 'Tip stuba: ' + rasveta.stub + ',<br> visina: ' + rasveta.visina + ',<br> tip sijalice: ' + rasveta.tipsijalice + '<br>' + 'w:' + snaga;
    } else {
      info = 'Tip stuba: ' + rasveta.stub + ', visina: ' + rasveta.visina;
    }

    const divElement = document.createElement('div');

    const pElement = document.createElement('p');
    pElement.innerHTML = info;
    pElement.innerHTML += '<br\>';
    divElement.appendChild(pElement);
    marker.bindPopup(divElement);
    this.rasvetaMarkers.addLayer(marker);

  }

  removeRasveta() {
    this.rasvetaMarkers.clearLayers();
  }

  changedLayerPreview(layer: Layer) {
    switch (layer.vrsta) {
      case 't':
      case 'T':

        break;
      case 'p':
      case 'P':
        this.listaLmpPoligonLayera.find(l => l.layerId === layer.id).lmp.forEach(poligon => {
          poligon.setStyle({
            color: layer.strokeColor,
            opacity: layer.strokeOpacity,
            fillColor: layer.fillColor,
            fillOpacity: layer.fillOpacity
          });
        });
        break;
      case 'l':
      case 'L':

        break;
    }
  }
}
