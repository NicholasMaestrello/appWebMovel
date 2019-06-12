import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {ErrorPage} from "../error/error";
import {ImovelDTO, ResidenciaUsuarioDTO} from "../../model/residencias";
import {Storage} from "@ionic/storage";
import {MaskConverter} from "../../shared/helper/mask-converter";

/**
 * Componente de cadastro e manutençao dos imoveis do usuario
 */
@Component({
  selector: 'page-residencia-usuario-form',
  templateUrl: 'residencia-usuario-form.html',
})
export class ResidenciaUsuarioFormPage implements OnInit {
  residenciaForm: FormGroup;
  estados$: Observable<any>;
  newResidencia = true;
  user = '';
  loader: Loading;

  /**
   * Construtor padrão com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param httpClient
   * @param fb
   * @param viewCtrl
   * @param storage
   * @param modalCtrl
   * @param loadingCtrl
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider,
              private fb: FormBuilder,
              public viewCtrl: ViewController,
              private storage: Storage,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
  }

  /**
   * Metodo inicial chamado quando o componente é chamado
   */
  ngOnInit(): void {
    const idImovel = this.navParams.data.item;
    this.estados$ = this.getEstados();
    this.createForm();
    this.createFormSubscribe();
    this.getUser();

    if (!!idImovel) {
      this.newResidencia = false;
      this.getResidenciaDetalhe(idImovel);
    }
  }

  /**
   * Metodo para buscar os detalhes da residencia
   * @param idResidencia
   */
  getResidenciaDetalhe(idResidencia: number): void {
    this.createLoadingBar();
    this.loader.present();
    this.httpClient.getImoveisUsuarioDetalhe(idResidencia).subscribe(
      res => this.preencherFormulario(res),
      err => this.showError(err.error)
    );
  }

  /**
   * Metodo para criação do formulario
   */
  createForm(): void {
    this.residenciaForm = this.fb.group({
      id: [null],
      username: [null],
      kind: [null, [Validators.required]],
      for_sale: [false, [Validators.required]],
      for_rent: [false, [Validators.required]],
      latitude: [null],
      longitude: [null],
      sell_price: [null],
      rent_price: [null],
      area: [null, [Validators.required]],
      number_of_rooms: [null, [Validators.required]],
      number_of_parking_lots: [null, [Validators.required]],
      number_of_bathrooms: [null, [Validators.required]],
      address: this.fb.group({
        id: [null],
        zipcode: [null, [Validators.required]],
        state: [null, [Validators.required]],
        city: [null, [Validators.required]],
        neighborhood: [null, [Validators.required]],
        street_name: [null, [Validators.required]],
        street_number: [null, [Validators.required]],
        apartment: [null]
      })
    });
  }

  /**
   * Metodo para retornar o observable dos estados
   */
  private getEstados(): Observable<any> {
    return this.httpClient.getEstados();
  }

  /**
   * Metodo para criar o subscriber dos valores do formulario
   */
  createFormSubscribe(): void {
    this.zipcode.valueChanges.subscribe(
      r => {
        if (r && r.length == 9) {
          this.httpClient.getCep(MaskConverter.justDigitsValue(r)).subscribe(
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
        if (state && city && neighborhood && street_name && street_number) {
          this.httpClient.getLatLongAddress(state, city, neighborhood, street_name, street_number).subscribe(
            res => this.resolveLatLong(res),
            err => this.showError(err.error)
          );
        }
      }
    )
  }

  /**
   * Metodo para extrair os endereços do resultado da pesquisa por cep
   * @param cep
   */
  cepResponse(cep: any): void {
    this.residenciaForm.get('address').get('state').setValue(cep.uf);
    this.residenciaForm.get('address').get('city').setValue(cep.localidade);
    this.residenciaForm.get('address').get('neighborhood').setValue(cep.bairro);
    this.residenciaForm.get('address').get('street_name').setValue(cep.logradouro);
  }

  /**
   * Metodo para criar o dto dos imoveis
   */
  createResidenciaDTO(): ImovelDTO {
    const formValue = this.residenciaForm.value;
    const imovel: ImovelDTO = {
      property: {
        kind: formValue.kind,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        area: formValue.area,
        username: this.user,
        sell_price: 0,
        rent_price: 0,
        number_of_rooms: formValue.number_of_rooms,
        number_of_parking_lots: formValue.number_of_parking_lots,
        number_of_bathrooms: formValue.number_of_bathrooms,
        address: {
          city: formValue.address.city,
          street_name: formValue.address.street_name,
          state: formValue.address.state,
          street_number: formValue.address.street_number,
          apartment: formValue.address.apartment,
          neighborhood: formValue.address.neighborhood,
          zipcode: MaskConverter.justDigitsValue(formValue.address.zipcode)
        }
      }
    };
    if (formValue.id) {
      imovel.property.id = formValue.id
    }
    if (formValue.address && formValue.address.id) {
      imovel.property.address.id = formValue.address.id;
    }
    if (formValue.for_sale) {
      imovel.property.for_sale = formValue.for_sale;
      imovel.property.sell_price = MaskConverter.numberValue(formValue.sell_price);
    }
    if (formValue.for_rent) {
      imovel.property.for_rent = formValue.for_rent;
      imovel.property.rent_price = MaskConverter.numberValue(formValue.rent_price);
    }
    return imovel;
  }

  /**
   * Metodo tratar o envento de salvar
   */
  salvar(): void {
    this.createLoadingBar();
    this.loader.present();
    if (this.newResidencia) {
      this.cadastrar();
    } else {
      this.alterar();
    }
  }

  /**
   * Metodo para cadastrar um novo imovel
   */
  cadastrar(): void {
    const imovel = this.createResidenciaDTO();
    this.httpClient.postImoveisUsuario(imovel).subscribe(
      res => {
        this.loader.dismiss();
        this.viewCtrl.dismiss();
      },
      err => this.showError(err.error)
    )
  }

  /**
   * metodo para alterar um imovel
   */
  alterar(): void {
    const imovel = this.createResidenciaDTO();
    this.httpClient.putImoveisUsuario(imovel.property.id, imovel).subscribe(
      res => {
        this.loader.dismiss();
        this.viewCtrl.dismiss();
      },
      err => this.showError(err.error)
    )
  }

  /**
   * Metodo para preencher o formulario com um imovel
   * @param imovel
   */
  preencherFormulario(imovel: ResidenciaUsuarioDTO): void {
    if (imovel.rent_price == '0.0') {
      imovel.rent_price = null;
      // @ts-ignore
    } else if (imovel.rent_price.split('.')[1].length == 1) {
      imovel.rent_price += '0';
    }
    if (imovel.sell_price == '0.0') {
      imovel.sell_price = null;
      // @ts-ignore
    } else if (imovel.sell_price.split('.')[1].length == 1) {
      imovel.sell_price += '0';
    }
    this.residenciaForm.patchValue(imovel);
    this.loader.dismiss();
  }

  /**
   * Metodo para extrar a latitude e a longitude da chamada da api da google de geocoding
   * @param googleGeocoding
   */
  resolveLatLong(googleGeocoding: any): void {
    try {
      let lat = googleGeocoding.results[0].geometry.location.lat;
      let lng = googleGeocoding.results[0].geometry.location.lng
      this.latitude.setValue(lat);
      this.longitude.setValue(lng);
    } catch (err) {
      console.log(err)
    } finally {
      // do nothing
    }
  }

  /**
   * Metodo para pegar o nome do usuario logado
   */
  getUser(): void {
    this.storage.get('userName').then(value => {
      this.user = value;
    })
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

  /**
   * Metodo para mostrar erros na modal
   * @param err
   */
  showError(err): void {
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage, {err: err});
    modal.present();
  }

  /**
   * Metodo para mostrar barra de carrendo
   */
  createLoadingBar(): void {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }
}
