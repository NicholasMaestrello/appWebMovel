import {Component, OnInit} from '@angular/core';
import {AlertController, Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {ResidenciaUsuarioFormPage} from '../residencia-usuario-form/residencia-usuario-form';
import {Storage} from "@ionic/storage";
import {ResidenciaUsuarioDTO} from "../../model/residencias";
import {ErrorPage} from "../error/error";
import {HttpClientProvider} from "../../providers/http-client/http-client";

@Component({
  selector: 'page-residencia-usuario-list',
  templateUrl: 'residencia-usuario-list.html',
})
export class ResidenciaUsuarioListPage implements OnInit {
  icons: string[];
  residencias: ResidenciaUsuarioDTO[];
  loader: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private httpClient: HttpClientProvider,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.getResidenciasUsuario();
  }

  getResidenciasUsuario() {
    this.createLoadingBar();
    this.loader.present();
    this.storage.get('userName').then((val: string) => {
      this.httpClient.getImoveisUsuario(val).subscribe(
        res => {
          this.loader.dismiss();
          this.residencias = res;
        },
        err => this.showError(err)
      )
    });
  }

  editar(imovel: ResidenciaUsuarioDTO) {
    this.navCtrl.push(ResidenciaUsuarioFormPage, {
      item: imovel.id
    });
  }

  novo() {
    this.navCtrl.push(ResidenciaUsuarioFormPage);
  }

  showError(err) {
    console.log(err);
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage);
    modal.present();
  }

  createLoadingBar() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }

  refresh() {
    this.getResidenciasUsuario();
  }

  excluir(imovel: ResidenciaUsuarioDTO) {
    const prompt = this.alertCtrl.create({
      title: 'Atenção',
      message: "Você esta prestes a realizar uma ação que não podera ser desfeita. Deseja continuar ?",
      buttons: [
        {
          text: 'Confirm',
          handler: data => {
            this.createLoadingBar();
            this.httpClient.deleteImoveisUsuario(imovel.id).subscribe(
              res => {
                this.loader.dismiss();
                this.getResidenciasUsuario();
              },
              err => this.showError(err)
            );
          }
        },
        {
          text: 'Cancel',
          handler: data => console.log('do nothing')
        }
      ]
    });
    prompt.present();
  }
}
