import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {
  erros: any[];

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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
