import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ResidenciaDetalhePage} from '../residencia-detalhe/residencia-detalhe';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";
import {FilterPage} from "../filter/filter";
import {Observable} from "rxjs";

@Component({
  selector: 'page-residencia-list',
  templateUrl: 'residencia-list.html',
})
export class ResidenciaListPage implements OnInit {
  imoveis$: Observable<ResidenciaDTO[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider) {
  }

  ngOnInit(): void {
    this.buscarImovelGambs();
    this.buscarImoveis();
  }

  showInfo(id: number) {
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: id
    });
  }

  buscarImovelGambs() {
    this.imoveis$ = this.httpClient.getImoveisFiltrados(null);
  }

  buscarImoveis() {
    this.httpClient.filtro.subscribe(value => {
      this.imoveis$ = this.httpClient.getImoveisFiltrados(value);
    })
  }

  openFilter() {
    this.navCtrl.push(FilterPage);
  }
}
