// Backend enum values — must match COMMISSION_TYPE and CHARGE_TYPE on the server
export type CommissionType = 'PAYIN' | 'PAYOUT';
export type ChargeType = 'PERCENTAGE' | 'FLAT';

export interface CommissionSlab {
  id: string;
  commissionId: string;
  minAmount: number;
  maxAmount: number | null; // null = unlimited
  chargeType: ChargeType;
  chargeValue: number;
  gstPercentage: number | null; // null = use plan's defaultGstPercentage
  priority: number;
  isActive: boolean;
}

export interface CommissionPlan {
  id: string;
  name: string;
  type: CommissionType;
  description?: string;
  defaultGstPercentage: number;
  isActive: boolean;
  slabs?: CommissionSlab[];
}

export interface CreateCommissionDto {
  name: string;
  type: CommissionType;
  description?: string;
  defaultGstPercentage?: number;
}

export interface UpdateCommissionDto {
  name?: string;
  type?: CommissionType;
  description?: string;
  defaultGstPercentage?: number;
  isActive?: boolean;
}

export interface CreateCommissionSlabDto {
  minAmount: number;
  maxAmount: number | null;
  chargeType: ChargeType;
  chargeValue: number;
  gstPercentage?: number | null;
  priority?: number;
}

export interface UpdateCommissionSlabDto {
  minAmount?: number;
  maxAmount?: number | null;
  chargeType?: ChargeType;
  chargeValue?: number;
  gstPercentage?: number | null;
  priority?: number;
  isActive?: boolean;
}

export interface AssignCommissionToUserDto {
  payinCommissionId: string;
  payoutCommissionId?: string | null;
}

export interface UserCommissionMapping {
  id: string;
  userId: string;
  payinCommissionId: string;
  payoutCommissionId: string | null;
  isActive: boolean;
  payinCommission?: CommissionPlan;
  payoutCommission?: CommissionPlan | null;
}
