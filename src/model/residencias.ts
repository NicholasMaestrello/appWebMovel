import {User} from "./user";

export class ImovelDTO {
  property: ResidenciaUsuarioDTO;
}

export class ResidenciaUsuarioDTO {
  id?: number;
  kind?: string;
  for_sale?: boolean;
  for_rent?: boolean;
  latitude?: number;
  longitude?: number;
  sell_price?: number;
  rent_price?: number;
  area?: number;
  username?: string;
  number_of_rooms?: number;
  number_of_parking_lots?: number;
  number_of_bathrooms?: number;
  address?: AddressDTO;
  images?: any[];
}

export class ResidenciaDTO {
  id: number;
  kind: string;
  for_sale: boolean;
  for_rent: boolean;
  latitude: string;
  longitude: string;
  sell_price: string;
  rent_price: string;
  area: string;
  user?: User;
  number_of_rooms?: number;
  number_of_parking_lots?: number;
  number_of_bathrooms?: number;
  address: AddressDTO;
}

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
