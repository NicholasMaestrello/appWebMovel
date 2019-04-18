import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ResidenciaUsuarioFormPage } from '../residencia-usuario-form/residencia-usuario-form';

/**
 * Generated class for the ResidenciaUsuarioListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-residencia-usuario-list',
  templateUrl: 'residencia-usuario-list.html',
})
export class ResidenciaUsuarioListPage {
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResidenciaUsuarioListPage');
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ResidenciaUsuarioFormPage, {
      item: item
    });
  }

}
