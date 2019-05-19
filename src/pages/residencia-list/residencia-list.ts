import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ResidenciaDetalhePage } from '../residencia-detalhe/residencia-detalhe';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";

/**
 * Generated class for the ResidenciaListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-residencia-list',
  templateUrl: 'residencia-list.html',
})
export class ResidenciaListPage {

  residencias: ResidenciaDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider) {
  }

  ionViewDidLoad() {
    this.buscarImoveis();
  }

  itemTapped(id: number) {
    // navegando para pagina de detalhes da residencia
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: id
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
    this.residencias = residencias;
  }

}
