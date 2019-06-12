import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import {ErrorPage} from "../error/error";
import {HttpClientProvider} from "../../providers/http-client/http-client";

/**
 * Componente de photos do imovel para cadastro e edição
 */
@Component({
  selector: 'page-residencia-usuario-photo',
  templateUrl: 'residencia-usuario-photo.html',
})
export class ResidenciaUsuarioPhotoPage implements OnInit {
  images = [];
  loader: Loading;
  idImovel = null;

  /**
   * Construtor padrào com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param imagePicker
   * @param httpClient
   * @param modalCtrl
   * @param loadingCtrl
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private imagePicker: ImagePicker,
              public httpClient: HttpClientProvider,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
  }

  /**
   * Primeiro metodo invocado quando o componente é criado
   */
  ngOnInit(): void {
    this.idImovel = this.navParams.data.item;
    this.getResidenciaDetalhe(this.idImovel);
  }

  /**
   * Metodo para chamar a api de detalhamento da residencia, dentro da qual existem as imagens
   * @param idResidencia
   */
  getResidenciaDetalhe(idResidencia: number): void {
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

  /**
   * Metodo para mostar o image picker para o usuario selecionar a foto que deseja salvar
   */
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

  /**
   * Metodo para mostra os erros
   * @param err
   */
  showError(err): void {
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage, {err: err});
    modal.present();
  }

  /**
   * Metodo para mostrar a barra de carregando
   */
  createLoadingBar(): void {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }

  /**
   * Metodo para chamar a inclusão de uma nova imagem
   */
  novo(): void {
    this.showImagePicker();
  }

  /**
   * MEtodo para tratar quando o deseja remover a foto
   * @param image
   */
  removeImage(image: string): void {
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

  /**
   * MEtodo para chamar a api para salvar a imagem
   * @param image
   */
  saveImage(image: any): void {
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
