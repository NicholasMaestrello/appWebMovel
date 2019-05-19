export class ResidenciaUsuarioDTO {
  "id"?: number;
  "kind": string;
  "for_sale": boolean;
  "for_rent": boolean;
  "latitude": number;
  "longitude": number;
  "sell_price": number;
  "rent_price": number;
  "area": number;
  "username": string;
  "address"?: addressDTO;

  public constructor(init?: Partial<ResidenciaUsuarioDTO>) {
    Object.assign(this, init);
  }
}

export class ResidenciaDTO {
  "id": number;
  "kind": string;
  "for_sale": boolean;
  "for_rent": boolean;
  "address_id": number;
  "latitude": string;
  "longitude": string;
  "sell_price": string;
  "rent_price": string;
  "area": string;
  "user_id": number
}

export class addressDTO {
  "city": string;
  "street_name": string;
  "state": string;
  "street_number": string;
  "apartment": string;
  "neighborhood": string;
  "zipcode": string;
}
