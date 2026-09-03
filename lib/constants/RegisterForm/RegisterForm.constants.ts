import {
  DesignationOptionsProps,
  Entityprops,
  IndustryType,
  TurnoverType,
} from '@/lib/interfaces/register-interface';

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

export const businessTypes: Entityprops[] = [
  { key: BUSINESS_TYPES.INDIVIDUAL, label: 'Individual / Freelancer' },
  { key: BUSINESS_TYPES.SOLE_PROPRIETORSHIP, label: 'Sole Proprietorship' },
  { key: BUSINESS_TYPES.PARTNERSHIP, label: 'Partnership' },
  {
    key: BUSINESS_TYPES.PUBLIC_PRIVATE_LTD,
    label: 'Public / Private Limited Company',
  },
  { key: BUSINESS_TYPES.TRUST_NGO_SOCIETIES, label: 'Trust / NGO / Societies' },
  { key: BUSINESS_TYPES.LLP, label: 'LLP' },
  { key: BUSINESS_TYPES.UNREGISTERED, label: 'Company yet to register' },
];

export const designationOptions: DesignationOptionsProps[] = [
  {
    label: 'CXO',
    key: 'founder/cxo',
  },
  {
    label: 'SVP/EVP/VP',
    key: 'svp/evp/vp',
  },
  {
    label: 'Director',
    key: 'director',
  },
  {
    label: 'Manager',
    key: 'manager',
  },
  {
    label: 'Accountant',
    key: 'accountant',
  },
  {
    label: 'Chartered Accountant',
    key: 'ca',
  },
  {
    label: 'Other',
    key: 'other',
  },
];

export const industryTypes: IndustryType[] = [
  {
    key: 1,
    label: 'Agriculture',
  },
  {
    key: 2,
    label: 'Architect / Interiors',
  },
  {
    key: 3,
    label: 'Automobile / Repairs',
  },
  {
    key: 4,
    label: 'Construction / Builders',
  },
  {
    key: 5,
    label: 'Consultancy',
  },
  {
    key: 6,
    label: 'Creative / Art',
  },
  {
    key: 7,
    label: 'Dealer',
  },
  {
    key: 8,
    label: 'E-Commerce',
  },
  {
    key: 9,
    label: 'Educational Institution',
  },
  {
    key: 10,
    label: 'Electronics / Hardware',
  },
  {
    key: 11,
    label: 'Entertainment',
  },
  {
    key: 12,
    label: 'Event Management',
  },
  {
    key: 13,
    label: 'Financial Services',
  },
  {
    key: 14,
    label: 'Food and Beverages',
  },
  {
    key: 15,
    label: 'Freelancer',
  },
  {
    key: 16,
    label: 'Health',
  },
  {
    key: 17,
    label: 'Hospitality',
  },
  {
    key: 18,
    label: 'Import / Export',
  },
  {
    key: 19,
    label: 'Insurance',
  },
  {
    key: 20,
    label: 'IT / Software',
  },
  {
    key: 21,
    label: 'Jewellery',
  },
  {
    key: 22,
    label: 'Manpower / HR',
  },
  {
    key: 23,
    label: 'Manufacturer',
  },
  {
    key: 24,
    label: 'Marketing Agency',
  },
  {
    key: 25,
    label: 'Miscellaneous',
  },
  {
    key: 26,
    label: 'Mobile / Computer Accessories',
  },
  {
    key: 27,
    label: 'NGO',
  },
  {
    key: 28,
    label: 'Online Services',
  },
  {
    key: 29,
    label: 'Pet Shop',
  },
  {
    key: 30,
    label: 'Photography / Studio',
  },
  {
    key: 31,
    label: 'Printing',
  },
  {
    key: 32,
    label: 'Provisional Store',
  },
  {
    key: 33,
    label: 'Engineering Services',
  },
  {
    key: 34,
    label: 'Real Estate',
  },
  {
    key: 35,
    label: 'Retailer / Supplier',
  },
  {
    key: 36,
    label: 'Saloon / Lifestyle',
  },
  {
    key: 37,
    label: 'Media / Advt',
  },
  {
    key: 38,
    label: 'Tours And Travels',
  },
  {
    key: 39,
    label: 'Trading',
  },
  {
    key: 40,
    label: 'Transportation / Logistics',
  },
  {
    key: 41,
    label: 'Wholesaler',
  },
  {
    key: 42,
    label: 'Distributors',
  },
  {
    key: 43,
    label: 'Gambling / Casino',
  },
  {
    key: 44,
    label: 'Multi Level Marketing',
  },
  {
    key: 45,
    label: 'Drop Shipping',
  },
  {
    key: 46,
    label: 'BPO',
  },
  {
    key: 47,
    label: 'Live Stock',
  },
  {
    key: 48,
    label: 'Crowd Funding',
  },
  {
    key: 49,
    label: 'Tobacco',
  },
  {
    key: 50,
    label: 'Wine Shop',
  },
  {
    key: 51,
    label: 'Unlicensed Finance Services',
  },
];

export enum TURNOVER_TYPE {
  ZERO_TO_TWENTY_FIVE_LAC = 1,
  TWENTY_FIVE_TO_FIFTY_LAC = 2,
  FIFTY_LAC_TO_TWO_CR = 3,
  TWO_CR_TO_TEN_CR = 4,
  TEN_CR_PLUS = 5,
}

export const turnoverOptions: TurnoverType[] = [
  { key: TURNOVER_TYPE.ZERO_TO_TWENTY_FIVE_LAC, label: '0 - 25L' },
  { key: TURNOVER_TYPE.TWENTY_FIVE_TO_FIFTY_LAC, label: '25L - 50L' },
  { key: TURNOVER_TYPE.FIFTY_LAC_TO_TWO_CR, label: '50L - 2CR' },
  { key: TURNOVER_TYPE.TWO_CR_TO_TEN_CR, label: '2CR - 10CR' },
  { key: TURNOVER_TYPE.TEN_CR_PLUS, label: '10CR +' },
];
