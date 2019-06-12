import {Component, OnInit} from '@angular/core';
import {AlertController, Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {ResidenciaUsuarioFormPage} from '../residencia-usuario-form/residencia-usuario-form';
import {Storage} from "@ionic/storage";
import {ResidenciaUsuarioDTO} from "../../model/residencias";
import {ErrorPage} from "../error/error";
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ResidenciaUsuarioPhotoPage} from "../residencia-usuario-photo/residencia-usuario-photo";

/**
 * Componete de listagem dos imoveis do usuario
 */
@Component({
  selector: 'page-residencia-usuario-list',
  templateUrl: 'residencia-usuario-list.html',
})
export class ResidenciaUsuarioListPage implements OnInit {
  icons: string[];
  residencias: ResidenciaUsuarioDTO[];
  loader: Loading;

  /**
   * Construtor padrão com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param storage
   * @param httpClient
   * @param modalCtrl
   * @param loadingCtrl
   * @param alertCtrl
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private httpClient: HttpClientProvider,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
  }

  /**
   * Primeiro metodo chamado apos a criação do compoentne
   */
  ngOnInit(): void {
    this.getResidenciasUsuario();
  }

  /**
   * Metodo para buscar os imoveis do usuario
   */
  getResidenciasUsuario(): void {
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

  /**
   * Metodo para chamar a pagina de edição de imoveis
   * @param imovel
   */
  editar(imovel: ResidenciaUsuarioDTO): void {
    this.navCtrl.push(ResidenciaUsuarioFormPage, {
      item: imovel.id
    });
  }

  /**
   * Metodo para chamar a pagina de novo imovel
   */
  novo(): void {
    this.navCtrl.push(ResidenciaUsuarioFormPage);
  }

  /**
   * Metodo para mostra erros na modal de erros
   * @param err
   */
  showError(err): void {
    console.log(err);
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage);
    modal.present();
  }

  /**
   * Metodo para mostrar barra de carregando
   */
  createLoadingBar(): void {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }

  /**
   * Metodo para dar refresh na pagina
   */
  refresh(): void {
    this.getResidenciasUsuario();
  }

  /**
   * Metodo para chamar api de exclusão de residencia
   * @param imovel
   */
  excluir(imovel: ResidenciaUsuarioDTO): void {
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

  /**
   * MEtodo para chamar a pagina de photos do imovel
   * @param imovel
   */
  fotos(imovel: ResidenciaUsuarioDTO): void {
    this.navCtrl.push(ResidenciaUsuarioPhotoPage, {
      item: imovel.id
    });
  }
}
