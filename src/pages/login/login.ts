import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {CadastroUsuarioPage} from '../cadastro-usuario/cadastro-usuario';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {HttpClientProvider} from '../../providers/http-client/http-client';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto} from "../../model/login.dto";
import {ErrorPage} from "../error/error";
import {ResidenciaUsuarioFormPage} from "../residencia-usuario-form/residencia-usuario-form";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private fb: FormBuilder,
              private httpClient: HttpClientProvider,
              public modalCtrl: ModalController) {
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
    const login = this.criarLoginDTO();
    this.httpClient.login(login).subscribe(
      res => {
        console.log(res);
        this.storage.set('authToken', res.token);
        this.storage.set('userName', res.username);
        this.navCtrl.setRoot(HomePage);
      }, err => {
        console.log(err);
        const modal = this.modalCtrl.create(ErrorPage);
        modal.present();
      }
    )
  }

  cadastrar() {
    this.navCtrl.push(CadastroUsuarioPage, {
      item: true
    });
  }

  criarLoginDTO(): LoginDto {
    const login: LoginDto = {
      'login': {
        'email': this.email.value,
        'password': this.senha.value
      }
    }
    return login;
  }

  // get dos controls
  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get senha(): AbstractControl {
    return this.loginForm.get('senha');
  }
}
