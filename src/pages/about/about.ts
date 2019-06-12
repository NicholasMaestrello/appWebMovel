import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Componente de about, aonde consta apenas informações sobre o sistema
 */
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
