import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ResidenciaDetalhePage} from '../residencia-detalhe/residencia-detalhe';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {Observable} from "rxjs";
import {FilterPage} from "../filter/filter";
import {ResidenciaDTO} from "../../model/residencias";
import {Geolocation} from '@ionic-native/geolocation';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage implements OnInit {
  imoveis$: Observable<ResidenciaDTO[]>;

  latUsuario = -21.763409;
  lngUsuario = -43.349034;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpClient: HttpClientProvider,
              private geolocation: Geolocation) {
  }

  ngOnInit(): void {
    this.buscarImovelGambs();
    this.buscarImoveis();
    this.getLocation();
  }

  buscarImovelGambs() {
    this.imoveis$ = this.httpClient.getImoveisFiltrados(null);
  }

  buscarImoveis() {
    this.httpClient.filtro.subscribe(value => {
      this.imoveis$ = this.httpClient.getImoveisFiltrados(value);
    })
  }


  showDetalhe(imovel: ResidenciaDTO) {
    // navegando para pagina de detalhes da residencia
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: imovel.id
    });
  }

  getLat(imovel: ResidenciaDTO) {
    return parseFloat(imovel.latitude)
  }

  getLgn(imovel: ResidenciaDTO) {
    return parseFloat(imovel.longitude)
  }

  onChoseLocation(event) {
    // TODO fazer algo
  }

  openFilter() {
    this.navCtrl.push(FilterPage);
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then(
      pos => {
        if (pos.coords) {
          this.latUsuario = pos.coords.latitude;
          this.lngUsuario = pos.coords.longitude;
        }
      }
    )
  }
}
