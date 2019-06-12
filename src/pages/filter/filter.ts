import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {Observable} from "rxjs";
import {Storage} from "@ionic/storage";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Filtro} from "../../model/filtro";
import {MaskConverter} from "../../shared/helper/mask-converter";

/**
 * Componente de filtro de imoveis
 */
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage implements OnInit {
  estados$: Observable<any>;
  filterForm: FormGroup;

  /**
   * Construtor padrão com serviços a serem injetados
   * @param navCtrl
   * @param navParams
   * @param httpClient
   * @param storage
   * @param viewCtrl
   * @param fb
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpClient: HttpClientProvider,
              private storage: Storage,
              private viewCtrl: ViewController,
              private fb: FormBuilder) {
  }

  /**
   * Metodo chamado apos a criação do componente para iniciar certos comportamentos
   */
  ngOnInit(): void {
    this.estados$ = this.getEstados();
    this.createForm();
    this.getFiltroMemory();
  }

  /**
   * Metodo que chama a atualização do filtro
   * @param dissmis
   */
  filtrar(dissmis: boolean): void {
    this.atualizarFiltro(this.filterForm.value);
    this.storage.set('filtro', this.filterForm.value);
    if(dissmis) {
      this.viewCtrl.dismiss();
    }
  }

  /**
   * Metodo para retornar um observable para a lista de estados
   */
  private getEstados(): Observable<any> {
    return this.httpClient.getEstados();
  }

  /**
   * Metodo para criaçào de formulario
   */
  private createForm(): void {
    this.filterForm = this.fb.group({
      min_sell_value: [null],
      max_sell_value: [null],
      min_rent_value: [null],
      max_rent_value: [null],
      min_area_size: [null],
      max_area_size: [null],
      for_sale: [null],
      for_rent: [null],
      number_of_rooms: [null],
      number_of_parking_lots: [null],
      number_of_bathrooms: [null],
      kind: [null],
      street: [null],
      state: [null],
      city: [null],
      neighborhood: [null]
    });
  }

  /**
   * metodo para retornar o filtro da memoria
   */
  private getFiltroMemory(): void {
    this.storage.get('filtro').then((value: Filtro) => {
      this.filterForm.patchValue(value);
    })
  }

  /**
   * Metodo para limpar o filtro do formulario
   */
  clear(): void {
    this.filterForm.reset();
    this.filtrar(false);
  }

  /**
   * Metodo para atualizar o filtro
   * @param formValue
   */
  atualizarFiltro(formValue: any) {
    const filtro = JSON.parse(JSON.stringify(formValue));
    filtro.min_sell_value = MaskConverter.numberValue(formValue.min_sell_value);
    filtro.max_sell_value = MaskConverter.numberValue(formValue.max_sell_value);
    filtro.min_rent_value = MaskConverter.numberValue(formValue.min_rent_value);
    filtro.max_rent_value = MaskConverter.numberValue(formValue.max_rent_value);
    this.httpClient.atualizarFiltro(filtro);
  }
}
