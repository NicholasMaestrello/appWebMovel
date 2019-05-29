import {Component, OnInit} from '@angular/core';
import {
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Toast,
  ToastController
} from 'ionic-angular';
import {CadastroUsuarioPage} from '../cadastro-usuario/cadastro-usuario';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {HttpClientProvider} from '../../providers/http-client/http-client';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto} from "../../model/login.dto";
import {ErrorPage} from "../error/error";
import {Network} from "@ionic-native/network";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loader: Loading;
  toast: Toast;
  disconnectSubscription: any;
  connectSubscription: any;
  isInternet = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private fb: FormBuilder,
              private httpClient: HttpClientProvider,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private network: Network) {
  }

  ngOnInit(): void {
    this.createForm();
    this.checkNetwork();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      senha: [null, [Validators.required]]
    });
  }

  logar() {
    this.showLoadingBar()
    const login = this.criarLoginDTO();
    this.httpClient.login(login).subscribe(
      res => this.loginSucesso(res),
      err => this.showError(err.error)
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

  loginSucesso(res: any) {
    this.storage.set('authToken', res.token);
    this.storage.set('userName', res.username);
    this.httpClient.atualizarToken(res.token);
    this.loader.dismiss();
    this.navCtrl.setRoot(HomePage);
  }

  showError(err) {
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage, {err: err});
    modal.present();
  }

  // get dos controls
  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get senha(): AbstractControl {
    return this.loginForm.get('senha');
  }

  showToast(message: string) {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    this.toast.present();
  }

  checkNetwork() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.showToast('Sem conexão com a internet');
    });

    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.toast.dismiss();
      this.showToast('Conectado a rede movel');
    });
  }
}
