import {Component, OnInit} from '@angular/core';
import {Loading, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpClientProvider} from '../../providers/http-client/http-client';
import {Observable} from 'rxjs/Observable';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {User, UserDTO} from "../../model/user";
import {ErrorPage} from "../error/error";
import {Storage} from "@ionic/storage";
import {MaskConverter} from "../../shared/helper/mask-converter";

/**
 * Componente de cadastro e edição do usuario
 */
@Component({
  selector: 'page-cadastro-usuario',
  templateUrl: 'cadastro-usuario.html',
})
export class CadastroUsuarioPage implements OnInit {
  estados$: Observable<any>;
  usuarioForm: FormGroup;
  novoUsuario = false;
  loader: Loading;

  /**
   * Construtor com serviços injetados
   * @param navCtrl
   * @param navParams
   * @param httpClient
   * @param fb
   * @param viewCtrl
   * @param storage
   * @param modalCtrl
   * @param loadingCtrl
   */
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

  /**
   * Primeiro metodo a ser executado apos a criação do componente, verificando se é uma edição ou criação de usuario
   * e chamando os primeiros metodos
   */
  ngOnInit(): void {
    const novoUsuario = this.navParams.data.item;

    this.createForm();
    this.createFormSubscribe();
    this.estados$ = this.getEstados();
    this.checkMode(novoUsuario);
  }

  /**
   * metodo que retorna um observable para a lista de estados
   */
  public getEstados(): Observable<any> {
    return this.httpClient.getEstados();
  }

  /**
   * Metodo para criação do formulario
   */
  createForm(): void {
    this.usuarioForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      document: [null, [Validators.required]],
      birthdate: [null, [Validators.required]],
      zipcode: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      street_name: [null, [Validators.required]],
      street_number: [null, [Validators.required]],
      apartment: [null],
      telephone: [null, [Validators.required]],
      cell_phone: [null, [Validators.required]]
    });
  }

  /**
   * Metodo que cria um subscribe para a troca de valores do formulario
   */
  createFormSubscribe(): void {
    this.cep.valueChanges.subscribe(
      r => {
        if (r && r.length == 9) {
          this.httpClient.getCep(MaskConverter.justDigitsValue(r)).subscribe(
            res => this.cepResponse(res)
          )
        }
      }
    )
  }

  /**
   * Metodo que retorna um validator para checar se o valor das senhas digitados é igual
   */
  confirmarSenhaIgual(): ValidatorFn {
    return (control: FormGroup): { [key: string]: any } => {
      const senha = control.get('password').value;
      const comfirmSenha = control.get('password_confirmation').value
      const retorno = senha === comfirmSenha ? null : {'senhasDiferentes': {value: 'Senha e Confirmar Senha com valores diferentes'}};

      return retorno;
    };
  }

  /**
   * Metodo que seta os valores apos o retorno da chamada de endereço por cep
   * @param cep
   */
  cepResponse(cep: any): void {
    this.estado.setValue(cep.uf);
    this.cidade.setValue(cep.localidade);
    this.bairro.setValue(cep.bairro);
    this.rua.setValue(cep.logradouro);
  }

  /**
   * Metodo que checa se o componente esta em modo de edição
   * @param novoUsuario
   */
  checkMode(novoUsuario): void {
    if (!!novoUsuario) {
      this.novoUsuario = true;
      this.usuarioForm.addControl('senhaGroup', this.fb.group({
          password: [null, [Validators.required]],
          password_confirmation: [null, [Validators.required]]
        }, {validator: Validators.compose([this.confirmarSenhaIgual()])}
      ))
    } else {
      this.novoUsuario = false;
      this.getUser();
    }
  }

  /**
   * metodo que recupera os detalhes do usuario atual
   */
  private getUser(): void {
    this.createLoadingBar();
    this.loader.present();
    this.storage.get('userName').then((val: string) => {
      this.httpClient.getUser(val).subscribe(
        res => this.populateUserForm(res),
        err => this.showError(err.error)
      )
    });
  }

  /**
   * Metodo para popular o formulario com os dados do uaurio
   * @param user
   */
  populateUserForm(user: User): void {
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

  /**
   * Metodo que retorna o dto de usuario a partir do formulario
   */
  createUserDTO(): UserDTO {
    const formValue = this.usuarioForm.value;
    const user: User = {
      name: formValue.name,
      username: formValue.username,
      email: formValue.email,
      document: MaskConverter.justDigitsValue(formValue.document),
      birthdate: formValue.birthdate,
      zipcode: formValue.zipcode,
      state: formValue.state,
      city: formValue.city,
      neighborhood: formValue.neighborhood,
      street_name: formValue.street_name,
      street_number: formValue.street_number,
      apartment: formValue.apartment,
      telephone: MaskConverter.justDigitsValue(formValue.telephone),
      cell_phone: MaskConverter.justDigitsValue(formValue.cell_phone)
    }

    if (this.novoUsuario) {
      user.password = formValue.senhaGroup.password;
      user.password_confirmation = formValue.senhaGroup.password_confirmation
    }

    const userDTO: UserDTO = {
      user: user
    }

    return userDTO;
  }

  /**
   * metodo de salvar
   */
  salvar(): void {
    this.createLoadingBar();
    this.loader.present();
    if (this.novoUsuario) {
      this.cadastrar();
    } else {
      this.alterar();
    }
  }

  /**
   * metodo para cadastrar o usuario
   */
  cadastrar() {
    const user = this.createUserDTO();
    this.httpClient.postUser(user).subscribe(
      res => {
        this.loader.dismiss();
        this.viewCtrl.dismiss();
      }, err => this.showError(err.error)
    )
  }

  /**
   * metodo para alterar o usuario
   */
  alterar() {
    const user = this.createUserDTO();
    this.httpClient.patchUser(user.user.username, user).subscribe(
      res => {
        this.loader.dismiss();
        this.getUser();
      }, err => this.showError(err.error)
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

  /**
   * metodo para mostrar a barra de loading
   */
  createLoadingBar(): void {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
  }

  /**
   * metodo para mostar modal de erros
   * @param err
   */
  showError(err): void {
    this.loader.dismiss();
    const modal = this.modalCtrl.create(ErrorPage, {err: err});
    modal.present();
  }
}
