import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ResidenciaDetalhePage} from '../residencia-detalhe/residencia-detalhe';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";
import {Observable} from "rxjs";

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage implements OnInit {
  imoveis$: Observable<ResidenciaDTO[]>;
  residencias: ResidenciaDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpClient: HttpClientProvider) {
  }

  ngOnInit(): void {
    this.buscarImoveis();
    this.setarPosicaoAtual();
  }

  setarPosicaoAtual() {
    // TODO recuperar posicão atual
  }

  buscarImoveis() {
    this.imoveis$ = this.httpClient.getImoveisFiltrados(null);
  }


  showDetalhe(imovel: ResidenciaDTO) {
    // navegando para pagina de detalhes da residencia
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: imovel.id
    });
  }

  getLat(imovel: ResidenciaDTO) {
    return parseFloat(imovel.latitude)
  }

  getLgn(imovel: ResidenciaDTO) {
    return parseFloat(imovel.longitude)
  }

  onChoseLocation(event) {
    // TODO fazer algo
  }
}
