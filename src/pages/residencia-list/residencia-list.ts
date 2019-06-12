import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ResidenciaDetalhePage} from '../residencia-detalhe/residencia-detalhe';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaDTO} from "../../model/residencias";
import {FilterPage} from "../filter/filter";
import {Observable} from "rxjs";
import {Storage} from "@ionic/storage";
import {Filtro} from "../../model/filtro";

/**
 * Componente de listagem de imoveis
 */
@Component({
  selector: 'page-residencia-list',
  templateUrl: 'residencia-list.html',
})
export class ResidenciaListPage implements OnInit {
  imoveis$: Observable<ResidenciaDTO[]>;

  /**
   * Construtor padrão com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param storage
   * @param httpClient
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public httpClient: HttpClientProvider) {
  }

  /**
   * Primeiro metodo a ser chamado quando o componente é construido
   */
  ngOnInit(): void {
    this.buscarImovelGambs();
    this.buscarImoveis();
  }

  /**
   * Componente para chamar a pagina de detalhes
   * @param id
   */
  showInfo(id: number): void {
    this.navCtrl.push(ResidenciaDetalhePage, {
      item: id
    });
  }

  /**
   * Metodo para atribuir o observable de imoveis
   */
  buscarImovelGambs(): void {
    this.imoveis$ = this.httpClient.getImoveisFiltrados(null);
  }

  /**
   * Metodo para buscar os imoveis
   */
  buscarImoveis(): void {
    this.httpClient.filtro.subscribe(value => {
      this.imoveis$ = this.httpClient.getImoveisFiltrados(value);
    })
  }

  /**
   * Metodo para abrir a pagina de filtro
   */
  openFilter(): void {
    this.navCtrl.push(FilterPage);
  }

  /**
   * Metodo de refresh
   */
  refresh(): void {
    this.storage.get('filtro').then((value: Filtro) => {
      this.httpClient.atualizarFiltro(value)
    })
  }
}
