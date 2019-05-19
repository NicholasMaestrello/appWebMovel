import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {ResidenciaUsuarioFormPage} from '../residencia-usuario-form/residencia-usuario-form';
import {Storage} from "@ionic/storage";
import {ResidenciaUsuarioDTO} from "../../model/residencias";
import {ErrorPage} from "../error/error";
import {HttpClientProvider} from "../../providers/http-client/http-client";

@Component({
  selector: 'page-residencia-usuario-list',
  templateUrl: 'residencia-usuario-list.html',
})
export class ResidenciaUsuarioListPage implements OnInit{
  icons: string[];
  residencias: ResidenciaUsuarioDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private httpClient: HttpClientProvider,
              public modalCtrl: ModalController) {
  }

  ngOnInit(): void {
    this.getResidenciasUsuario();
  }

  getResidenciasUsuario() {
    this.storage.get('userName').then((val: string) => {
      this.httpClient.getImoveisUsuario(val).subscribe(
        res => this.residencias = res,
        err => {
          console.log(err);
          const modal = this.modalCtrl.create(ErrorPage);
          modal.present();
        }
      )
    });
  }

  editar(event, imovel: ResidenciaUsuarioDTO) {
    console.log(imovel);
    this.navCtrl.push(ResidenciaUsuarioFormPage, {
      item: imovel.id
    });
  }

  novo() {
    this.navCtrl.push(ResidenciaUsuarioFormPage);
  }

  excluir(event, imovel: ResidenciaUsuarioDTO) {
    // TODO chamar api de delete
  }
}
