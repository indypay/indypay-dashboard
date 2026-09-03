import { TURNOVER_TYPE } from '../constants/RegisterForm/RegisterForm.constants';

export interface BusinessTypesProps {
  value: number;
  name: string;
}

export interface DesignationOptionsProps {
  label: string;
  key: string;
}

export type Key = string | BUSINESS_TYPES | TURNOVER_TYPE;
export enum BUSINESS_TYPES {
  INDIVIDUAL = 1,
  SOLE_PROPRIETORSHIP = 2,
  PARTNERSHIP = 3,
  PUBLIC_PRIVATE_LTD = 4,
  TRUST_NGO_SOCIETIES = 5,
  LLP = 6,
  OTHERS = 7,
  UNREGISTERED = 8,
  FREELANCE = 9,
}
export interface Entityprops {
  key: number | string;
  label: string;
}

export interface IndustryType {
  key: Key | number;
  label: string;
}

export interface TurnoverType {
  key: Key;
  label: string;
}

export interface MerchantDetailsProps {
  email: string | null;
  businessEntityType: number;
  // industry: number;
  turnover: number;
  businessName: string;
  designation: string;
}

export interface UserDetailsProps {
  mobile: string;
  password: string;
}

export interface BusinessDetailsProps {
  businessName: string;
  registeredBusinessNumber: string;
  typeOfBusiness: number;
  industryName: number;
  turnover: number;
  designation: string;
}
