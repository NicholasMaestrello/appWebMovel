import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {CadastroUsuarioPage} from '../cadastro-usuario/cadastro-usuario';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {HttpClientProvider} from '../../providers/http-client/http-client';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto} from "../../model/login.dto";
import {ErrorPage} from "../error/error";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loader: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private fb: FormBuilder,
              private httpClient: HttpClientProvider,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      senha: [null, [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logar() {
    this.showLoadingBar()
    const login = this.criarLoginDTO();
    this.httpClient.login(login).subscribe(
      res => {
        this.storage.set('authToken', res.token);
        this.storage.set('userName', res.username);
        this.httpClient.atualizarToken();
        this.loader.dismiss();
        this.navCtrl.setRoot(HomePage);
      }, err => this.showError(err)
    )
  }

  cadastrar() {
    this.navCtrl.push(CadastroUsuarioPage, {
      item: true
    });
  }

  criarLoginDTO(): LoginDto {
    const login: LoginDto = {
      login: {
        email: this.email.value,
        password: this.senha.value
      }
    }
    return login;
  }

  showLoadingBar() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    this.loader.present();
  }

  showError(err) {
    console.log(err);
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage);
    modal.present();
  }

  // get dos controls
  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get senha(): AbstractControl {
    return this.loginForm.get('senha');
  }
}
