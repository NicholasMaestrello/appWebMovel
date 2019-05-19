import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {UserDTO} from "../../model/user";
import {ErrorPage} from "../error/error";
import {ResidenciaUsuarioDTO} from "../../model/residencias";

@Component({
  selector: 'page-residencia-usuario-form',
  templateUrl: 'residencia-usuario-form.html',
})
export class ResidenciaUsuarioFormPage implements OnInit {
  residenciaForm: FormGroup;
  estados$: Observable<any>;

  newResidencia = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider,
              private fb: FormBuilder,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController) {
  }

  ngOnInit(): void {
    const idImovel = this.navParams.data.item;
    this.estados$ = this.getEstados();
    this.createForm();
    this.createFormSubscribe();

    if(!!idImovel) {
      this.newResidencia = false;
      this.getResidenciaDetalhe(idImovel);
    }
  }

  getResidenciaDetalhe(idResidencia: number) {
    this.httpClient.getImoveisUsuarioDetalhe(idResidencia).subscribe(
      res => this.preencherFormulario(res),
      err => console.log(err)
    );
  }

  createForm() {
    this.residenciaForm = this.fb.group({
      id: [null],
      username: [null],
      kind: [null],
      for_sale: [null],
      for_rent: [null],
      latitude: [null],
      longitude: [null],
      sell_price: [null],
      rent_price: [null],
      area: [null],
      address: this.fb.group({
        zipcode: [null],
        state: [null],
        city: [null],
        neighborhood: [null],
        street_name: [null],
        street_number: [null],
        apartment: [null]
      })
    });
  }

  private getEstados() {
    return this.httpClient.getEstados();
  }

  createFormSubscribe() {
    this.zipcode.valueChanges.subscribe(
      r => {
        if (r && r.length == 8) {
          this.httpClient.getCep(r).subscribe(
            res => this.cepResponse(res)
          )
        }
      }
    );
    this.address.valueChanges.subscribe(
      v => {
        const state = v.state;
        const city = v.city;
        const neighborhood = v.neighborhood;
        const street_name = v.street_name;
        const street_number = v.street_number;
        if(state && city && neighborhood && street_name && street_number) {
          this.httpClient.getLatLongAddress(state, city, neighborhood, street_name, street_number).subscribe(
            res => this.resolveLatLong(res),
            err => this.showError(err)
          );
        }
      }
    )
  }

  cepResponse(cep: any) {
    this.residenciaForm.get('address').get('state').setValue(cep.uf);
    this.residenciaForm.get('address').get('city').setValue(cep.localidade);
    this.residenciaForm.get('address').get('neighborhood').setValue(cep.bairro);
    this.residenciaForm.get('address').get('street_name').setValue(cep.logradouro);
  }

  salvar() {
    if(this.newResidencia) {
      this.cadastrar();
    } else {
      this.alterar();
    }
  }

  createResidenciaDTO(): ResidenciaUsuarioDTO {
    const formValue = this.residenciaForm.value;
    const residenciaUsuario: ResidenciaUsuarioDTO = new ResidenciaUsuarioDTO(formValue);
    console.log(residenciaUsuario);
    return residenciaUsuario;
  }

  cadastrar() {
    const imovel = this.createResidenciaDTO();
    this.httpClient.postImoveisUsuario(imovel).subscribe(
      res => this.viewCtrl.dismiss(),
        err => this.showError(err)
    )
  }

  alterar() {
    const imovel = this.createResidenciaDTO();
    console.log(imovel)
    this.httpClient.putImoveisUsuario(imovel).subscribe(
      res => this.viewCtrl.dismiss(),
        err => this.showError(err)
    )
  }

  preencherFormulario(imovel: ResidenciaUsuarioDTO) {
    this.residenciaForm.setValue(imovel);
  }

  resolveLatLong(googleGeocoding: any) {
    try {
      let lat = googleGeocoding.results[0].geometry.location.lat;
      let lng = googleGeocoding.results[0].geometry.location.lng
      this.latitude.setValue(lat);
      this.longitude.setValue(lng);
    } finally {
      // do nothing
    }
  }

  showError(err: any) {
    console.log(err);
    const modal = this.modalCtrl.create(ErrorPage);
    modal.present();
  }

  // get dos controls
  get zipcode(): AbstractControl {
    return this.residenciaForm.get('address').get('zipcode');
  }

  get address(): AbstractControl {
    return this.residenciaForm.get('address');
  }

  get latitude(): AbstractControl {
    return this.residenciaForm.get('latitude');
  }

  get longitude(): AbstractControl {
    return this.residenciaForm.get('longitude');
  }

}
