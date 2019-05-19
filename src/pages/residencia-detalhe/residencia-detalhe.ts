import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";

@Component({
  selector: 'page-residencia-detalhe',
  templateUrl: 'residencia-detalhe.html',
})
export class ResidenciaDetalhePage {

  residencia: ResidenciaDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider) {
  }

  ionViewDidLoad() {
    this.getResidenciaDetalhe(this.navParams.data.item);
  }

  getResidenciaDetalhe(idResidencia: number) {
    this.httpClient.getImoveisDetalhe(idResidencia).subscribe(
      res => this.residencia = res,
      err => console.log(err)
    );
  }

}
