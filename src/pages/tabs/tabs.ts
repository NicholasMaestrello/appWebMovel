import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';
import { ResidenciaListPage } from '../residencia-list/residencia-list';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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
