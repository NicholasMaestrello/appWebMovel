import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from '../../providers/http-client/http-client';
import {Observable} from 'rxjs/Observable';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {User, UserDTO} from "../../model/user";
import {ErrorPage} from "../error/error";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-cadastro-usuario',
  templateUrl: 'cadastro-usuario.html',
})
export class CadastroUsuarioPage implements OnInit {
  estados$: Observable<any>;
  usuarioForm: FormGroup;
  novoUsuario = false;
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpClient: HttpClientProvider,
    private fb: FormBuilder,
    public viewCtrl: ViewController,
    private storage: Storage,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
    const novoUsuario = this.navParams.data.item;

    this.createForm();
    this.createFormSubscribe();
    this.estados$ = this.getEstados();
    this.checkMode(novoUsuario);
  }

  public getEstados() {
    return this.httpClient.getEstados();
  }

  createForm() {
    this.usuarioForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null],
      email: [null],
      document: [null],
      birthdate: [null],
      zipcode: [null],
      state: [null],
      city: [null],
      neighborhood: [null],
      street_name: [null],
      street_number: [null],
      apartment: [null],
      telephone: [null],
      cell_phone: [null]
    });
  }

  createFormSubscribe() {
    this.cep.valueChanges.subscribe(
      r => {
        if (r && r.length == 8) {
          this.httpClient.getCep(r).subscribe(
            res => this.cepResponse(res)
          )
        }
      }
    )
  }

  confirmarSenhaIgual(): ValidatorFn {
    return (control: FormGroup): { [key: string]: any } => {
      const senha = control.get('password').value;
      const comfirmSenha = control.get('password_confirmation').value
      const retorno = senha === comfirmSenha ? null : {'senhasDiferentes': {value: 'Senha e Confirmar Senha com valores diferentes'}};

      return retorno;
    };
  }

  cepResponse(cep: any) {
    this.estado.setValue(cep.uf);
    this.cidade.setValue(cep.localidade);
    this.bairro.setValue(cep.bairro);
    this.rua.setValue(cep.logradouro);
  }

  checkMode(novoUsuario) {
    if (!!novoUsuario) {
      this.novoUsuario = true;
      this.usuarioForm.addControl('senhaGroup', this.fb.group({
          password: [null],
          password_confirmation: [null]
        }, {validator: Validators.compose([this.confirmarSenhaIgual()])}
      ))
    } else {
      this.novoUsuario = false;
      this.getUser();
    }
  }

  private getUser() {
    this.createLoadingBar();
    this.loader.present();
    this.storage.get('userName').then((val: string) => {
      this.httpClient.getUser(val).subscribe(
        res => this.populateUserForm(res),
        err => this.showError(err)
      )
    });
  }

  populateUserForm(user: User) {
    this.usuarioForm.patchValue(
      {
        name: user.name,
        username: user.username,
        email: user.email,
        document: user.document,
        birthdate: user.birthdate,
        city: user.city,
        street_name: user.street_name,
        state: user.state,
        street_number: user.street_number,
        apartment: user.apartment,
        neighborhood: user.neighborhood,
        zipcode: user.zipcode,
        telephone: user.telephone,
        cell_phone: user.cell_phone
      }
    );
    this.loader.dismiss();
  }

  createUserDTO(): UserDTO {
    const formValue = this.usuarioForm.value;
    const user: User = {
      name: formValue.name,
      username: formValue.username,
      email: formValue.email,
      document: formValue.document,
      birthdate: formValue.birthdate,
      zipcode: formValue.zipcode,
      state: formValue.state,
      city: formValue.city,
      neighborhood: formValue.neighborhood,
      street_name: formValue.street_name,
      street_number: formValue.street_number,
      apartment: formValue.apartment,
      telephone: formValue.telephone,
      cell_phone: formValue.cell_phone
    }

    if (this.novoUsuario) {
      console.log(formValue)
      user.password = formValue.senhaGroup.password;
      user.password_confirmation = formValue.senhaGroup.password_confirmation
    }

    const userDTO: UserDTO = {
      user: user
    }

    return userDTO;
  }

  salvar() {
    this.createLoadingBar();
    this.loader.present();
    if (this.novoUsuario) {
      this.cadastrar();
    } else {
      this.alterar();
    }
  }

  cadastrar() {
    const user = this.createUserDTO();
    this.httpClient.postUser(user).subscribe(
      res => {
        this.loader.dismiss();
        this.viewCtrl.dismiss();
      }, err => this.showError(err)
    )
  }

  alterar() {
    const user = this.createUserDTO();
    this.httpClient.patchUser(user.user.username, user).subscribe(
      res => {
        this.loader.dismiss();
        this.getUser();
      }, err => this.showError(err)
    )
  }

  // get dos controls
  get cep(): AbstractControl {
    return this.usuarioForm.get('zipcode');
  }

  get estado(): AbstractControl {
    return this.usuarioForm.get('state');
  }

  get cidade(): AbstractControl {
    return this.usuarioForm.get('city');
  }

  get bairro(): AbstractControl {
    return this.usuarioForm.get('neighborhood');
  }

  get rua(): AbstractControl {
    return this.usuarioForm.get('street_name');
  }

  createLoadingBar() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }

  showError(err) {
    console.log(err);
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage);
    modal.present();
  }
}
