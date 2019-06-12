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

/**
 * Componente de login
 */
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

  /**
   * Construtor padrão com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param storage
   * @param fb
   * @param httpClient
   * @param modalCtrl
   * @param loadingCtrl
   * @param toastCtrl
   * @param network
   */
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

  /**
   * Primeiro metodo chamado apos a criação do componente
   */
  ngOnInit(): void {
    this.createForm();
    this.checkNetwork();
  }

  /**
   * metodo para criação do formulario
   */
  createForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      senha: [null, [Validators.required]]
    });
  }

  /**
   * Metodo para chamar a api de login
   */
  logar(): void {
    this.showLoadingBar()
    const login = this.criarLoginDTO();
    this.httpClient.login(login).subscribe(
      res => this.loginSucesso(res),
      err => this.showError(err.error)
    )
  }

  /**
   * Metodo para realizar a chamada para a pagina de cadastro
   */
  cadastrar(): void {
    this.navCtrl.push(CadastroUsuarioPage, {
      item: true
    });
  }

  /**
   * Metodo que cria o dto de login
   */
  criarLoginDTO(): LoginDto {
    const login: LoginDto = {
      login: {
        email: this.email.value,
        password: this.senha.value
      }
    }
    return login;
  }

  /**
   * metodo para mostrar barra de carregando
   */
  showLoadingBar(): void {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    this.loader.present();
  }

  /**
   * Metodo de resposta para quando o login é bem sucedido
   * @param res
   */
  loginSucesso(res: any): void {
    this.storage.set('authToken', res.token);
    this.storage.set('userName', res.username);
    this.httpClient.atualizarToken(res.token);
    this.loader.dismiss();
    this.navCtrl.setRoot(HomePage);
  }

  /**
   * Metodo para mostrar erros
   * @param err
   */
  showError(err): void {
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

  /**
   * Metodo para mostrar toast
   * @param message
   */
  showToast(message: string) {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    this.toast.present();
  }

  /**
   * Metodo para verificar se o usuario possui conexão com a internet
   */
  checkNetwork() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.showToast('Sem conexão com a internet');
      this.isInternet = false;
    });

    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.isInternet = true;
      this.toast.dismiss();
      this.showToast('Conectado a rede movel');
    });
  }
}
