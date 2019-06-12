/**
 * Classe helper para ajudar na conversão dos valores das mascaras
 */
export class MaskConverter {

  /**
   * Metodo que retona uma string contendo apenas os digitos dela
   * @param value
   */
  public static justDigitsValue(value: string = ''): string {
    if (!value) return '';
    return value.replace(/[^0-9]/g, '');
  }

  /**
   * Metodo que retona o valor numerico de uma string
   * @param value
   */
  public static numberValue(value: string = ''): number {
    if (!value) return 0;
    return Number(value.replace(/\./g, '').replace(/\,/, '.'));
  }
}
