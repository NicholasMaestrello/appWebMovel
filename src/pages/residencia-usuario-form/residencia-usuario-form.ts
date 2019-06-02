import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {ErrorPage} from "../error/error";
import {ImovelDTO, ResidenciaUsuarioDTO} from "../../model/residencias";
import {Storage} from "@ionic/storage";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";

@Component({
  selector: 'page-residencia-usuario-form',
  templateUrl: 'residencia-usuario-form.html',
})
export class ResidenciaUsuarioFormPage implements OnInit {
  residenciaForm: FormGroup;
  estados$: Observable<any>;
  newResidencia = true;
  user = '';

  //TODO remover
  images: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpClient: HttpClientProvider,
              private fb: FormBuilder,
              public viewCtrl: ViewController,
              private storage: Storage,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private imagePicker: ImagePicker) {
  }

  loader: Loading;

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

  getResidenciaDetalhe(idResidencia: number) {
    this.createLoadingBar();
    this.loader.present();
    this.httpClient.getImoveisUsuarioDetalhe(idResidencia).subscribe(
      res => this.preencherFormulario(res),
      err => this.showError(err.error)
    );
  }

  createForm() {
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
        apartment: [null, [Validators.required]]
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
        if (state && city && neighborhood && street_name && street_number) {
          this.httpClient.getLatLongAddress(state, city, neighborhood, street_name, street_number).subscribe(
            res => this.resolveLatLong(res),
            err => this.showError(err.error)
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
          zipcode: formValue.address.zipcode
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
      imovel.property.sell_price = formValue.sell_price;
    }
    if (formValue.for_rent) {
      imovel.property.for_rent = formValue.for_rent;
      imovel.property.rent_price = formValue.rent_price;
    }

    imovel.property.images = this.images;
    return imovel;
  }

  salvar() {
    this.createLoadingBar();
    this.loader.present();
    if (this.newResidencia) {
      this.cadastrar();
    } else {
      this.alterar();
    }
  }

  cadastrar() {
    const imovel = this.createResidenciaDTO();
    this.httpClient.postImoveisUsuario(imovel).subscribe(
      res => {
        this.loader.dismiss();
        this.viewCtrl.dismiss();
      },
      err => this.showError(err.error)
    )
  }

  alterar() {
    const imovel = this.createResidenciaDTO();
    this.httpClient.putImoveisUsuario(imovel.property.id, imovel).subscribe(
      res => {
        this.loader.dismiss();
        this.viewCtrl.dismiss();
      },
      err => this.showError(err.error)
    )
  }

  preencherFormulario(imovel: ResidenciaUsuarioDTO) {
    this.residenciaForm.patchValue(imovel);
    this.loader.dismiss();
  }

  resolveLatLong(googleGeocoding: any) {
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

  getUser() {
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

  showError(err) {
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage, {err: err});
    modal.present();
  }

  createLoadingBar() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }

  showImagePicker() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 5,
      outputType: 1,
      width: 100,
      height: 100,
    }
    this.imagePicker.getPictures(options).then((results) => {
      if (results.length > 0) {
        this.images = [];
        for (var i = 0; i < results.length; i++) {
          const base64Data = results[i];
          this.images.push(["data:image/jpeg;base64", base64Data]);
        }
      }
    }, (err) => {
      this.showError(err)
    });
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }
}
