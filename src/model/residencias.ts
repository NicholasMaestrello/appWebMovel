import {User} from "./user";

/**
 * Classe de imovel utilizada nos POST e PUT de imoveis de um usuario
 */
export class ImovelDTO {
  property: ResidenciaUsuarioDTO;
}

/**
 * Classe contendo as informações que o usuario vai fornecer da residencia para a casa
 */
export class ResidenciaUsuarioDTO {
  id?: number;
  kind?: string;
  for_sale?: boolean;
  for_rent?: boolean;
  latitude?: number;
  longitude?: number;
  sell_price?: number | string;
  rent_price?: number | string;
  area?: number;
  username?: string;
  number_of_rooms?: number;
  number_of_parking_lots?: number;
  number_of_bathrooms?: number;
  address?: AddressDTO;
  images?: any[];
}

/**
 * Classe contendo as informações vindas do servidor em resposta a procura de imoveis
 */
export class ResidenciaDTO {
  id: number;
  kind: string;
  for_sale: boolean;
  for_rent: boolean;
  latitude: string;
  longitude: string;
  sell_price: string | string;
  rent_price: string | string;
  area: string;
  user?: User;
  number_of_rooms?: number;
  number_of_parking_lots?: number;
  number_of_bathrooms?: number;
  address: AddressDTO;
  images?: any[];
}

/**
 * classe com informações de endereço
 */
export class AddressDTO {
  id?: number;
  city: string;
  street_name: string;
  state: string;
  street_number: string;
  apartment: string;
  neighborhood: string;
  zipcode: string;
}
