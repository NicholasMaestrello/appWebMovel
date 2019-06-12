import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Componente de exibição de erros
 */
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {
  erros: any[];

  /**
   * Construtor padrão com serviços
   * @param navCtrl
   * @param navParams
   * @param viewCtrl
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    let err = navParams.get('err');
    if (err && err.errors && Array.isArray(err.errors)) {
      this.erros = err.errors;
    } else if (err && err.errors) {
      this.erros = [err.errors];
    } else if (err && err.error) {
      this.erros = [err.error];
    }
  }

  /**
   * metodo para fechar pagina
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
