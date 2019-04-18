import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CadastroUsuarioPage } from '../cadastro-usuario/cadastro-usuario';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logar() {
    // this.viewCtrl.dismiss();
    this.navCtrl.setRoot(HomePage);
  }

  cadastrar() {
    this.navCtrl.push(CadastroUsuarioPage);
  }
}
