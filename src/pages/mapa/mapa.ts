import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ResidenciaDetalhePage } from '../residencia-detalhe/residencia-detalhe';

declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  map: any;

  tab1: any;
  tab2: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.setarPosicaoAtual();
    this.setarImoveis();
  }

  setarPosicaoAtual() {
    const position = new google.maps.LatLng(-21.763409, -43.349034);
 
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

  setarImoveis() {
      const localizacao = new google.maps.LatLng(-21.763595, -43.349155);
      new google.maps.Marker({
        position: localizacao,
        map: this.map,
        animation: google.maps.Animation.DROP
        // icon: iconHouse
      }).addListener('click', () => this.itemTapped());
  }

  itemTapped() {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: null
    });
  }
}
