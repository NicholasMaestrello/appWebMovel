import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User, UserDTO} from "../../model/user";
import {LoginDto, LoginRes} from "../../model/login.dto";
import {ImovelDTO, ResidenciaDTO, ResidenciaUsuarioDTO} from "../../model/residencias";
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


  constructor(public http: HttpClient) {
  }

  public atualizarToken(token: string) {
    this.token = token;
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

  public patchUser(userName: string, user: UserDTO): Observable<any> {
    const authHeader = this.getAuthHeader();
    return this.http.patch(`${this.urlApiWebMovel}users/${userName}`, user, authHeader)
  }

  public getUser(username: string): Observable<User> {
    const authHeader = this.getAuthHeader();
    return this.http.get<User>(`${this.urlApiWebMovel}users/${username}`, authHeader);
  }

  public login(login: LoginDto): Observable<LoginRes> {
    this.getAuthHeader();
    return this.http.post<LoginRes>(`${this.urlApiWebMovel}auth/login/`, login);
  }

  // apis residencias para pesquisar
  public getImoveisFiltrados(filtro: Filtro): Observable<ResidenciaDTO[]> {
    const params = this.resolveParamsPesquisa(filtro);
    const authHeader = this.getAuthHeader();
    if (params.keys() && params.keys().length > 0) {
      return this.http.get<ResidenciaDTO[]>(`${this.urlApiWebMovel}properties`, {
        params: params,
        headers: authHeader.headers
      });
    }
    console.log(authHeader);
    return this.http.get<ResidenciaDTO[]>(`${this.urlApiWebMovel}properties/`, authHeader);
  }

  public getImoveisDetalhe(idResidencia: number): Observable<ResidenciaDTO> {
    const authHeader = this.getAuthHeader();
    return this.http.get<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, authHeader);
  }

  // apis residencia usuario
  public getImoveisUsuario(userName: string): Observable<ResidenciaUsuarioDTO[]> {
    let authHeader = this.getAuthHeader();
    return this.http.get<ResidenciaUsuarioDTO[]>(`${this.urlApiWebMovel}users/${userName}/properties`, authHeader);
  }

  public getImoveisUsuarioDetalhe(idResidencia: number): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.get<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, authHeader);
  }

  public postImoveisUsuario(residencia: ImovelDTO): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.post<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties`, residencia, authHeader)
  }

  public putImoveisUsuario(idResidencia: number, residencia: ImovelDTO): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.patch<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, residencia, authHeader)
  }

  public deleteImoveisUsuario(idResidencia: number): Observable<any> {
    const authHeader = this.getAuthHeader();
    return this.http.delete<any>(`${this.urlApiWebMovel}properties/${idResidencia}`, authHeader);
  }

  public postImageImovel(idImovel: number, image: any): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    console.log(idImovel)
    return this.http.post<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idImovel}/images`, image, authHeader)
  }

  public deleteImageImovel(idImovel: number, filename: string): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.delete<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idImovel}/images/${filename}`, authHeader)
  }

  private resolveParamsPesquisa(filtro: Filtro): HttpParams {
    let params = new HttpParams();
    if (!filtro)
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
}
