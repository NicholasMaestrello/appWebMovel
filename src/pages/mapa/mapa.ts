import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ResidenciaDetalhePage} from '../residencia-detalhe/residencia-detalhe';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";

declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  map: any;

  tab1: any;
  tab2: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpClient: HttpClientProvider) {
  }

  ionViewDidLoad() {
    this.setarPosicaoAtual();
    this.buscarImoveis();
  }

  setarPosicaoAtual() {
    const position = new google.maps.LatLng("-21.763409", "-43.349034");

    const mapOptions = {
      zoom: 18,
      center: position,
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const marker = new google.maps.Marker({
      position: position,
      map: this.map,

      //Titulo
      title: 'Minha posição',

      //Animção
      animation: google.maps.Animation.DROP, // BOUNCE

      //Icone
      // icon: 'assets/imgs/pessoa.png'
    });
  }

  buscarImoveis() {
    this.httpClient.getImoveisFiltrados(null).subscribe(
      res => {
        this.setarImoveis(res);
      },
      err => {
        console.log(err)
      }
    )
  }

  setarImoveis(residencias: ResidenciaDTO[]) {
    for(let residencia of residencias) {
      console.log(residencia);
      const localizacao = new google.maps.LatLng(residencia.latitude, residencia.longitude);
      new google.maps.Marker({
        position: localizacao,
        map: this.map,
        animation: google.maps.Animation.DROP
        // icon: iconHouse
      }).addListener('click', () => this.itemTapped(residencia.id));
    }
  }

  itemTapped(id: number) {
    // navegando para pagina de detalhes da residencia
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: id
    });
  }
}
