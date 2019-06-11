import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {ErrorPage} from "../error/error";
import {HttpClientProvider} from "../../providers/http-client/http-client";

@Component({
  selector: 'page-residencia-usuario-photo',
  templateUrl: 'residencia-usuario-photo.html',
})
export class ResidenciaUsuarioPhotoPage implements OnInit {
  images = [];
  loader: Loading;
  idImovel = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private imagePicker: ImagePicker,
              public httpClient: HttpClientProvider,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
    this.idImovel = this.navParams.data.item;
    this.getResidenciaDetalhe(this.idImovel);
  }

  getResidenciaDetalhe(idResidencia: number) {
    this.createLoadingBar();
    this.loader.present();
    this.httpClient.getImoveisUsuarioDetalhe(idResidencia).subscribe(
      res => {
        this.loader.dismiss();
        this.images = res.images;
      },
      err => this.showError(err.error)
    );
  }

  showImagePicker() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      outputType: 1,
      width: 100,
      height: 100,
    }
    this.imagePicker.getPictures(options).then((results) => {
      if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          const base64Data = results[i];
          const image = ["data:image/jpeg;base64", base64Data];
          this.saveImage({property: {images: [image]}});
        }
      }
    }, (err) => {
      this.showError(err)
    });
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

  novo() {
    this.showImagePicker();
  }

  removeImage(image: string) {
    this.createLoadingBar();
    this.loader.present();

    const filename = image.split('/').pop();
    this.httpClient.deleteImageImovel(this.idImovel, filename).subscribe(
      res => {
        this.loader.dismiss();
        this.images = res.images;
      }, err => this.showError(err)
    )
  }

  saveImage(image: any) {
    this.createLoadingBar();
    this.loader.present();
    this.httpClient.postImageImovel(this.idImovel, image).subscribe(
      res => {
        this.loader.dismiss();
        this.images = res.images;
      }, err => this.showError(err)
    );
  }


}
