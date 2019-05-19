import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpClient: HttpClientProvider,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private storage: Storage) {
  }

  ngOnInit(): void {
    const novoUsuario = this.navParams.data.item;

    this.createForm();
    this.createFormSubscribe();
    this.estados$ = this.getEstados();

    if (!!novoUsuario) {
      this.novoUsuario = true;
    } else {
      this.novoUsuario = false;
      this.getUser();
    }
  }

  public getEstados() {
    return this.httpClient.getEstados();
  }

  createForm() {
    this.usuarioForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null],
      email: [null],
      senhaGroup: this.fb.group({
          password: [null],
          password_confirmation: [null]
        }, {validator: Validators.compose([this.confirmarSenhaIgual()])}
      ),
      document: [null],
      birthdate: [null],
      zipcode: [null],
      state: [null],
      city: [null],
      neighborhood: [null],
      street_name: [null],
      street_number: [null],
      apartment: [null]
    });
    console.log('aqui')
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

  private getUser() {
    this.storage.get('userName').then((val: string) => {
      this.httpClient.getUser(val).subscribe(
        res => this.populateUserForm(res),
        err => {
          console.log(err);
          const modal = this.modalCtrl.create(ErrorPage);
          modal.present();
        }
      )
    });
  }

  populateUserForm(user: User) {
    this.usuarioForm.setValue(
      {
        name: user.name,
        username: user.username,
        email: user.email,
        senhaGroup: {
          password: user.password,
          password_confirmation: user.password_confirmation,
        },
        document: user.document,
        birthdate: user.birthdate,
        city: user.city,
        street_name: user.street_name,
        state: user.state,
        street_number: user.street_number,
        apartment: user.apartment,
        neighborhood: user.neighborhood,
        zipcode: user.zipcode
      }
    )
  }

  createUserDTO(): UserDTO {
    const formValue = this.usuarioForm.value;
    const user: UserDTO = {
      user: {
        name: formValue.name,
        username: formValue.username,
        email: formValue.email,
        password: formValue.senhaGroup.password,
        password_confirmation: formValue.senhaGroup.password_confirmation,
        document: formValue.document,
        birthdate: formValue.birthdate,
        zipcode: formValue.zipcode,
        state: formValue.state,
        city: formValue.city,
        neighborhood: formValue.neighborhood,
        street_name: formValue.street_name,
        street_number: formValue.street_number,
        apartment: formValue.apartment
      }
    }
    return user;
  }

  salvar() {
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
        this.viewCtrl.dismiss();
      }, err => {
        console.log(err);
        const modal = this.modalCtrl.create(ErrorPage);
        modal.present();
      }
    )
  }

  alterar() {
    const user = this.createUserDTO();
    this.httpClient.patchUser(user).subscribe(
      res => {
        this.viewCtrl.dismiss();
      }, err => {
        console.log(err);
        const modal = this.modalCtrl.create(ErrorPage);
        modal.present();
      }
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
}
