export interface CstInfo {
  code: string;        // Ex: "50", "01"
  description: string; // Ex: "Operação com Direito a Crédito"
}

export interface TaxData {
  cstPisEntrada: CstInfo;
  cstPisSaida: CstInfo;
  cstCofinsEntrada: CstInfo;
  cstCofinsSaida: CstInfo;
}

export interface TaxRates {
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
  icms: number;
}

export interface SimilarTaxation {
  ncm: string;
  name: string;
  erpProfile: string; // Ex: "TRIBUTADO 19% CST 00" ou "ISENTO CST 40"
  cstEntry: string;   // Ex: "000" ou "E:000"
  cstOutput: string;  // Ex: "020" ou "S:020"
}

export interface NcmResponse {
  productName: string;
  description: string;
  ncmCode: string;
  taxes: TaxData;
  similarProducts: SimilarTaxation[];
  legalNote: string;
}