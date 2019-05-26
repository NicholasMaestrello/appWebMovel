import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User, UserDTO} from "../../model/user";
import {LoginDto, LoginRes} from "../../model/login.dto";
import {ResidenciaDTO, ResidenciaUsuarioDTO} from "../../model/residencias";
import {of} from "rxjs/observable/of";
import {Storage} from "@ionic/storage";
import {mapsConfig} from "../../environments/environment";
import {ReplaySubject} from "rxjs";
import {Filtro} from "../../model/filtro";

@Injectable()
export class HttpClientProvider {
  private urlApiWebMovel = 'https://webmovel.herokuapp.com/';
  private urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private urlMunicipios = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private urlViaCep = 'https://viacep.com.br/ws';
  private chaveGoogle = mapsConfig.apiKey;

  private token = '';

  private filtroSubject = new ReplaySubject();


  constructor(public http: HttpClient,
              private storage: Storage) {
  }

  public atualizarToken() {
    this.storage.get('authToken').then((val) => {
      this.token = val
    })
  }

  public atualizarFiltro(filtro) {
    this.filtroSubject.next(filtro);
  }

  public get filtro(): Observable<any> {
    return this.filtroSubject.asObservable();
  }

  private getAuthHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    }
    return httpOptions;
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
    this.getAuthHeader();
    return this.http.post<LoginRes>(`${this.urlApiWebMovel}auth/login/`, login);
  }

  // apis residencias para pesquisar
  public getImoveisFiltrados(filtro: Filtro): Observable<ResidenciaDTO[]> {
    const params = this.resolveParamsPesquisa(filtro);
    if(params.keys() && params.keys().length > 0){
      console.log('consulta com filtro');
    }
      // return this.http.get<ResidenciaDTO[]>(`${this.urlApiWebMovel}properties`, {params: params})
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
    let authHeader = this.getAuthHeader();
    return this.http.post<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties`, residencia, authHeader)
  }

  public putImoveisUsuario(residencia: ResidenciaUsuarioDTO): Observable<ResidenciaUsuarioDTO> {
    return this.getResidenciasUsuarioDetalheMock();
    // return this.http.patch<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, residencia)
  }

  public deleteImoveisUsuario(idResidencia: number): Observable<any> {
    return of();
    // return this.http.delete<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`)
  }

  private resolveParamsPesquisa(filtro: Filtro): HttpParams {
    let params = new HttpParams();
    if(!filtro)
      return params;
    if (filtro.kind) params = params.append('kind', filtro.kind);
    if (filtro.for_rent) params = params.append('for_rent', String(filtro.for_rent));
    if (filtro.for_sale) params = params.append('for_sale', String(filtro.for_sale));
    if (filtro.max_rent_value) params = params.append('max_rent_value', String(filtro.max_rent_value));
    if (filtro.min_rent_value) params = params.append('min_rent_value', String(filtro.min_rent_value));
    if (filtro.max_sell_value) params = params.append('max_sell_value', String(filtro.max_sell_value));
    if (filtro.min_sell_value) params = params.append('min_sell_value', String(filtro.min_sell_value));
    if (filtro.max_area_size) params = params.append('max_area_size', String(filtro.max_area_size));
    if (filtro.min_area_size) params = params.append('min_area_size', String(filtro.min_area_size));
    if (filtro.number_of_bathrooms) params = params.append('number_of_bathrooms', String(filtro.number_of_bathrooms));
    if (filtro.number_of_rooms) params = params.append('number_of_rooms', String(filtro.number_of_rooms));
    if (filtro.number_of_parking_lots) params = params.append('number_of_parking_lots', String(filtro.number_of_parking_lots));
    if (filtro.state) params = params.append('state', filtro.state);
    if (filtro.city) params = params.append('city', filtro.city);
    if (filtro.neighborhood) params = params.append('neighborhood', filtro.neighborhood);
    if (filtro.street) params = params.append('street', filtro.street);
    return params
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
      telephone: '1121298748',
      cell_phone: '11964896394'
    }
    return of(user);
  }

  private getResidenciasMock(): Observable<ResidenciaDTO[]> {
    const house1: ResidenciaDTO = {
      id: 1,
      kind: "Casa",
      for_sale: true,
      for_rent: true,
      address_id: 1,
      latitude: '-22.763409',
      longitude: '-41.349034',
      sell_price: '1900435.50',
      rent_price: "5000.00",
      area: "125",
      user_id: 1,
      address: {
        city: "São Paulo",
        street_name: "padre da nobrega",
        state: "SP",
        street_number: "1234",
        apartment: "123",
        neighborhood: "Jabaquara",
        zipcode: "1239923"
      }
    }
    const house2: ResidenciaDTO = {
      id: 1,
      kind: "Casa",
      for_sale: true,
      for_rent: true,
      address_id: 1,
      latitude: '-23.763409',
      longitude: '-42.349034',
      sell_price: '1900435.50',
      rent_price: "5000.00",
      area: "125",
      user_id: 1,
      address: {
        city: "São Paulo",
        street_name: "padre da nobrega",
        state: "SP",
        street_number: "1234",
        apartment: "123",
        neighborhood: "Jabaquara",
        zipcode: "1239923"
      }
    }
    const myObservable: Observable<ResidenciaDTO[]> = of([house1, house2]);
    return myObservable;
  }

  private getResidenciasDetalheMock(): Observable<ResidenciaDTO> {
    const house1: ResidenciaDTO = {
      id: 1,
      kind: "Casa",
      for_sale: true,
      for_rent: true,
      address_id: 1,
      latitude: '-22.763409',
      longitude: '-41.349034',
      sell_price: '1900435.50',
      rent_price: "5000.00",
      area: "125",
      user_id: 1,
      address: {
        city: "São Paulo",
        street_name: "padre da nobrega",
        state: "SP",
        street_number: "1234",
        apartment: "123",
        neighborhood: "Jabaquara",
        zipcode: "1239923"
      }
    }
    const myObservable: Observable<ResidenciaDTO> = of(house1);
    return myObservable;
  }

  private getResidenciasUsuarioMock(): Observable<ResidenciaUsuarioDTO[]> {
    const house1: ResidenciaUsuarioDTO = {
      id: 1,
      kind: "Casa",
      for_sale: true,
      for_rent: true,
      latitude: -22.763409,
      longitude: -41.349034,
      sell_price: 1900435.50,
      rent_price: 5000.00,
      area: 125,
      username: "nicholas",
      address: {
        city: "São Paulo",
        street_name: "padre da nobrega",
        state: "SP",
        street_number: "1234",
        apartment: "123",
        neighborhood: "Jabaquara",
        zipcode: "1239923"
      }
    }
    const house2: ResidenciaUsuarioDTO = {
      id: 2,
      kind: "Casa",
      for_sale: true,
      for_rent: true,
      latitude: -23.763409,
      longitude: -42.349034,
      sell_price: 1900435.50,
      rent_price: 5000.00,
      area: 125,
      username: "nicholas",
      address: {
        city: "São Paulo",
        street_name: "padre da nobrega",
        state: "SP",
        street_number: "1234",
        apartment: "123",
        neighborhood: "Jabaquara",
        zipcode: "1239923"
      }
    }
    const myObservable: Observable<ResidenciaUsuarioDTO[]> = of([house1, house2]);
    return myObservable;
  }

  private getResidenciasUsuarioDetalheMock(): Observable<ResidenciaUsuarioDTO> {
    const house1: ResidenciaUsuarioDTO = {
      id: 1,
      kind: "Casa",
      for_sale: true,
      for_rent: true,
      latitude: -22.763409,
      longitude: -41.349034,
      sell_price: 1900435.50,
      rent_price: 5000.00,
      area: 125,
      username: "nicholas",
      address: {
        city: "São Paulo",
        street_name: "padre da nobrega",
        state: "SP",
        street_number: "1234",
        apartment: "123",
        neighborhood: "Jabaquara",
        zipcode: "1239923"
      }
    }
    const myObservable: Observable<ResidenciaUsuarioDTO> = of(house1);
    return myObservable;
  }
}
