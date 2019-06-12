import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User, UserDTO} from "../../model/user";
import {LoginDto, LoginRes} from "../../model/login.dto";
import {ImovelDTO, ResidenciaDTO, ResidenciaUsuarioDTO} from "../../model/residencias";
import {mapsConfig} from "../../environments/environment";
import {ReplaySubject} from "rxjs";
import {Filtro} from "../../model/filtro";

/**
 * Serviço de http client, singleton, usado como camada para as requisições HTTP da aplicação
 */
@Injectable()
export class HttpClientProvider {
  private urlApiWebMovel = 'https://webmovel.herokuapp.com/';
  private urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private urlMunicipios = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
  private urlViaCep = 'https://viacep.com.br/ws';
  private chaveGoogle = mapsConfig.apiKey;

  private token = '';

  private filtroSubject = new ReplaySubject();

  /**
   * Construtor padrão
   * @param http biblioteca de http do angular
   */
  constructor(public http: HttpClient) {
  }

  /**
   * Metodo para atualizar o valor do token em memoria
   * @param token token oriundo do login
   */
  public atualizarToken(token: string) {
    this.token = token;
  }

  /**
   * Metodo para atualizar o valor do filtro de imoveis atual da aplicação.
   * @param filtro valor de filtro
   */
  public atualizarFiltro(filtro) {
    this.filtroSubject.next(filtro);
  }

  /**
   * valor que retorna um observable do valor do filtro, para sempre que ocorrer uma mudança no filtro
   * todos os incritos poderem saber
   */
  public get filtro(): Observable<any> {
    return this.filtroSubject.asObservable();
  }

  /**
   * metodo auxiliar que ajuda a montar o token default das requisições
   */
  private getAuthHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    }
    return httpOptions;
  }

  /**
   * Metodo que busca a latitude e longitude de um endereço
   * @param state Estado
   * @param city Cidade
   * @param neighborhood Bairro
   * @param street_name Nome da rua
   * @param street_number Numero da Rua
   */
  public getLatLongAddress(state, city, neighborhood, street_name, street_number): Observable<any> {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${street_name},${street_number},${city},${state}&components=country:BR&key=${this.chaveGoogle}`);
  }

  /**
   * Metodo que retorna a lista de Estados brasileiros
   */
  public getEstados<T>(): Observable<T> {
    return this.http.get<T>(this.urlEstados);
  }

  /**
   * Metodo que retorna a lista cidades de um estado
   * @param uf
   */
  public getCidades<T>(uf: string): Observable<T> {
    return this.http.get<T>(`${this.urlMunicipios}/${uf}/municipios`);
  }

  /**
   * Metodo que retorna o endereço completo a partir de um cep
   * @param cep
   */
  public getCep<T>(cep: String): Observable<T> {
    return this.http.get<T>(`${this.urlViaCep}/${cep}/json/`);
  }

  /**
   * Metodo para criação de um usuario
   * @param user
   */
  public postUser(user: UserDTO): Observable<any> {
    return this.http.post(`${this.urlApiWebMovel}users/`, user)
  }

  /**
   * Metodo para edição de um usuario
   * @param userName
   * @param user
   */
  public patchUser(userName: string, user: UserDTO): Observable<any> {
    const authHeader = this.getAuthHeader();
    return this.http.patch(`${this.urlApiWebMovel}users/${userName}`, user, authHeader)
  }

  /**
   * metodo que retona os dados de um usuario
   * @param username
   */
  public getUser(username: string): Observable<User> {
    const authHeader = this.getAuthHeader();
    return this.http.get<User>(`${this.urlApiWebMovel}users/${username}`, authHeader);
  }

  /**
   * Metodo que realiza o login da aplicação
   * @param login
   */
  public login(login: LoginDto): Observable<LoginRes> {
    this.getAuthHeader();
    return this.http.post<LoginRes>(`${this.urlApiWebMovel}auth/login/`, login);
  }

  // apis residencias para pesquisar

  /**
   * Metodo para obter os imoveis a partir de um filtro
   * @param filtro
   */
  public getImoveisFiltrados(filtro: Filtro): Observable<ResidenciaDTO[]> {
    const params = this.resolveParamsPesquisa(filtro);
    const authHeader = this.getAuthHeader();
    if (params.keys() && params.keys().length > 0) {
      return this.http.get<ResidenciaDTO[]>(`${this.urlApiWebMovel}properties`, {
        params: params,
        headers: authHeader.headers
      });
    }
    return this.http.get<ResidenciaDTO[]>(`${this.urlApiWebMovel}properties/`, authHeader);
  }

  /**
   * Metodo que retorna os detalhes de um imovel
   * @param idResidencia
   */
  public getImoveisDetalhe(idResidencia: number): Observable<ResidenciaDTO> {
    const authHeader = this.getAuthHeader();
    return this.http.get<ResidenciaDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, authHeader);
  }

  // apis residencia usuario

  /**
   * Metodo que retorna a lista de imovei de um usuario
   * @param userName
   */
  public getImoveisUsuario(userName: string): Observable<ResidenciaUsuarioDTO[]> {
    let authHeader = this.getAuthHeader();
    return this.http.get<ResidenciaUsuarioDTO[]>(`${this.urlApiWebMovel}users/${userName}/properties`, authHeader);
  }

  /**
   * Metodo que retorna os detalhes da residencia de um usuario
   * @param idResidencia
   */
  public getImoveisUsuarioDetalhe(idResidencia: number): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.get<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, authHeader);
  }

  /**
   * Metodo para criação de um imovel
   * @param residencia
   */
  public postImoveisUsuario(residencia: ImovelDTO): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.post<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties`, residencia, authHeader)
  }

  /**
   * Metodo para a edição de um imovel
   * @param idResidencia
   * @param residencia
   */
  public putImoveisUsuario(idResidencia: number, residencia: ImovelDTO): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.patch<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idResidencia}`, residencia, authHeader)
  }

  /**
   * Metodo para deletar um imovel
   * @param idResidencia
   */
  public deleteImoveisUsuario(idResidencia: number): Observable<any> {
    const authHeader = this.getAuthHeader();
    return this.http.delete<any>(`${this.urlApiWebMovel}properties/${idResidencia}`, authHeader);
  }

  /**
   * Metodo para salvar uma imagem em uma residencia
   * @param idImovel
   * @param image
   */
  public postImageImovel(idImovel: number, image: any): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.post<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idImovel}/images`, image, authHeader)
  }

  /**
   * Metodo para excluir a imagem de uma residencia
   * @param idImovel
   * @param filename
   */
  public deleteImageImovel(idImovel: number, filename: string): Observable<ResidenciaUsuarioDTO> {
    let authHeader = this.getAuthHeader();
    return this.http.delete<ResidenciaUsuarioDTO>(`${this.urlApiWebMovel}properties/${idImovel}/images/${filename}`, authHeader)
  }

  /**
   * Metodo auxiliar para montar dinamicamente os params de filtro dos imoveis
   * @param filtro
   */
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
