import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User, UserDTO} from "../../model/user";
import {LoginDto, LoginRes} from "../../model/login.dto";
import {ResidenciaDTO, ResidenciaUsuarioDTO} from "../../model/residencias";
import {of} from "rxjs/observable/of";
import {Storage} from "@ionic/storage";

@Injectable()
export class HttpClientProvider {
  private urlApiWebMovel = 'https://webmovel.herokuapp.com/';
  private urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private urlMunicipios = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private urlViaCep = 'https://viacep.com.br/ws';
  private chaveGoogle = '';

  constructor(public http: HttpClient,
              private storage: Storage,) {
  }

  private getToken() {
    this.storage.get('authToken').then((val) => {
      console.log('token', val);
    });
  }

  public getLatLongAddress(state, city, neighborhood, street_name, street_number): Observable<any> {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${street_name},${street_number},${city},${state}&components=country:BR&key=${this.chaveGoogle}`);
  }

  public getEstados<T>(): Observable<T> {
    return this.http.get<T>(this.urlEstados);
  }

  public getCidades<T>(uf: string): Observable<T> {
    return this.http.get<T>(`${this.urlMunicipios}/${uf}/municipios`);
  }

  public getCep<T>(cep: String): Observable<T> {
    return this.http.get<T>(`${this.urlViaCep}/${cep}/json/`);
  }

  public postUser(user: UserDTO): Observable<any> {
    return this.http.post(`${this.urlApiWebMovel}users/`, user)
  }

  public patchUser(user: UserDTO): Observable<any> {
    return this.http.patch(`${this.urlApiWebMovel}users/`, user)
  }

  public getUser(username: string): Observable<User> {
    return this.getUserMock();
    // return this.http.get(`${this.urlApiWebMovel}users/${username}`)
  }

  public login(login: LoginDto): Observable<LoginRes> {
    // return of({token: "maskldsflm", exp: "", username: "fulano"});
    return this.http.post<LoginRes>(`${this.urlApiWebMovel}auth/login/`, login);
  }

  // apis residencias para pesquisar
  public getImoveisFiltrados(filtro: any): Observable<ResidenciaDTO[]> {
    return this.getResidenciasMock();
    // return this.http.get<ResidenciaDTO[]>(`${this.urlApiWebMovel}properties/`)
  }

  public getImoveisDetalhe(idResidencia: number): Observable<ResidenciaDTO> {
    return this.getResidenciasDetalheMock();
    // return this.http.get<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`)
  }

  // apis residencia usuario
  public getImoveisUsuario(userName: string): Observable<ResidenciaUsuarioDTO[]> {
    return this.getResidenciasUsuarioMock();
    // return this.http.get<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`)
  }

  public getImoveisUsuarioDetalhe(idResidencia: number): Observable<ResidenciaUsuarioDTO> {
    return this.getResidenciasUsuarioDetalheMock();
    // return this.http.get<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`)
  }

  public postImoveisUsuario(residencia: ResidenciaUsuarioDTO): Observable<ResidenciaUsuarioDTO> {
    return this.getResidenciasUsuarioDetalheMock();
    // return this.http.post<ResidenciaDTO>(`${this.urlApiWebMovel}properties`, residencia)
  }

  public putImoveisUsuario(residencia: ResidenciaUsuarioDTO): Observable<ResidenciaUsuarioDTO> {
    return this.getResidenciasUsuarioDetalheMock();
    // return this.http.patch<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, residencia)
  }

  public deleteImoveisUsuario(idResidencia: number): Observable<any> {
    return of();
    // return this.http.delete<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`)
  }

  // Todo rerirar esses mocks

  private getUserMock(): Observable<User> {
    const user: User = {
      name: 'nicholas',
      username: 'nicholas',
      email: 'nicholas@mail.com',
      password: '123456',
      password_confirmation: '123456',
      document: '45898095837',
      birthdate: '1996-07-26',
      city: 'São Paulo',
      street_name: 'Rua Padre Adelino',
      state: 'SP',
      street_number: '930',
      apartment: 'Alto',
      neighborhood: 'Quarta Parada',
      zipcode: '03303000',
    }
    return of(user);
  }

  private getResidenciasMock(): Observable<ResidenciaDTO[]> {
    const house1: ResidenciaDTO = {
      "id": 1,
      "kind": "abcs",
      "for_sale": true,
      "for_rent": true,
      "address_id": 1,
      "latitude": '-22.763409',
      "longitude": '-41.349034',
      "sell_price": '1900435.50',
      "rent_price": "5000.00",
      "area": "125",
      "user_id": 1
    }
    const house2: ResidenciaDTO = {
      "id": 1,
      "kind": "abcs",
      "for_sale": true,
      "for_rent": true,
      "address_id": 1,
      "latitude": '-23.763409',
      "longitude": '-42.349034',
      "sell_price": '1900435.50',
      "rent_price": "5000.00",
      "area": "125",
      "user_id": 1
    }
    const myObservable: Observable<ResidenciaDTO[]> = of([house1, house2]);
    return myObservable;
  }

  private getResidenciasDetalheMock(): Observable<ResidenciaDTO> {
    const house1: ResidenciaDTO = {
      "id": 1,
      "kind": "abcs",
      "for_sale": true,
      "for_rent": true,
      "address_id": 1,
      "latitude": '-22.763409',
      "longitude": '-41.349034',
      "sell_price": '1900435.50',
      "rent_price": "5000.00",
      "area": "125",
      "user_id": 1
    }
    const myObservable: Observable<ResidenciaDTO> = of(house1);
    return myObservable;
  }

  private getResidenciasUsuarioMock(): Observable<ResidenciaUsuarioDTO[]> {
    const house1: ResidenciaUsuarioDTO = {
      "id": 1,
      "kind": "abcs",
      "for_sale": true,
      "for_rent": true,
      "latitude": -22.763409,
      "longitude": -41.349034,
      "sell_price": 1900435.50,
      "rent_price": 5000.00,
      "area": 125,
      "username": "nicholas",
      "address": {
        "city": "São Paulo",
        "street_name": "padre da nobrega",
        "state": "SP",
        "street_number": "1234",
        "apartment": "123",
        "neighborhood": "Jabaquara",
        "zipcode": "1239923"
      }
    }
    const house2: ResidenciaUsuarioDTO = {
      "id": 2,
      "kind": "abcs",
      "for_sale": true,
      "for_rent": true,
      "latitude": -23.763409,
      "longitude": -42.349034,
      "sell_price": 1900435.50,
      "rent_price": 5000.00,
      "area": 125,
      "username": "nicholas",
      "address": {
        "city": "São Paulo",
        "street_name": "padre da nobrega",
        "state": "SP",
        "street_number": "1234",
        "apartment": "123",
        "neighborhood": "Jabaquara",
        "zipcode": "1239923"
      }
    }
    const myObservable: Observable<ResidenciaUsuarioDTO[]> = of([house1, house2]);
    return myObservable;
  }

  private getResidenciasUsuarioDetalheMock(): Observable<ResidenciaUsuarioDTO> {
    const house1: ResidenciaUsuarioDTO = {
      "id": 1,
      "kind": "abcs",
      "for_sale": true,
      "for_rent": true,
      "latitude": -22.763409,
      "longitude": -41.349034,
      "sell_price": 1900435.50,
      "rent_price": 5000.00,
      "area": 125,
      "username": "nicholas",
      "address": {
        "city": "São Paulo",
        "street_name": "padre da nobrega",
        "state": "SP",
        "street_number": "1234",
        "apartment": "123",
        "neighborhood": "Jabaquara",
        "zipcode": "1239923"
      }
    }
    const myObservable: Observable<ResidenciaUsuarioDTO> = of(house1);
    return myObservable;
  }
}
