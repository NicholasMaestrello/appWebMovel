import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {Observable} from "rxjs";
import {Storage} from "@ionic/storage";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Filtro} from "../../model/filtro";

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage implements OnInit {
  estados$: Observable<any>;
  filterForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpClient: HttpClientProvider,
              private storage: Storage,
              private viewCtrl: ViewController,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.estados$ = this.getEstados();
    this.createForm();
    this.getFiltroMemory();
  }

  filtrar() {
    this.httpClient.atualizarFiltro(this.filterForm.value);
    this.storage.set('filtro', this.filterForm.value);
    this.viewCtrl.dismiss();
  }

  private getEstados() {
    return this.httpClient.getEstados();
  }

  private createForm() {
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

  private getFiltroMemory() {
    this.storage.get('filtro').then((value: Filtro) => {
      this.filterForm.patchValue(value);
    })
  }

  clear() {
    this.filterForm.reset();
    this.filtrar();
  }
}
