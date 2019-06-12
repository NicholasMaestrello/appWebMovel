import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";

/**
 * Componente de detalhe do imovel, para contato
 */
@Component({
  selector: 'page-residencia-detalhe',
  templateUrl: 'residencia-detalhe.html',
})
export class ResidenciaDetalhePage {

  residencia: ResidenciaDTO;

  /**
   * Construtor padrão com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param httpClient
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider) {
  }

  /**
   * Metodo chamado quando a tela carrega
   */
  ionViewDidLoad() {
    this.getResidenciaDetalhe(this.navParams.data.item);
  }

  /**
   * Metodo para buscar os detalhes do imovel
   * @param idResidencia
   */
  getResidenciaDetalhe(idResidencia: number) {
    this.httpClient.getImoveisDetalhe(idResidencia).subscribe(
      res => this.residencia = res,
      err => console.log(err)
    );
  }

}
