import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';
import { ResidenciaListPage } from '../residencia-list/residencia-list';

/**
 * Componente de tabs que so serve para controlar e alternar entre o mapa e a lista
 */
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tabMap: any = MapaPage;
  tabList: any = ResidenciaListPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
