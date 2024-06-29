// src/order/interfaces/sales.interface.ts

export interface Sales {
  id?: number;
  items: any[];
  total: number;
  madeBy?: number;
  cashPaid: number;
  mpesaPaid: number;
  bankPaid: number;
  totalAmountPaid: number;
  taxAmount?: number;
  discountAmount?: number;
  customerId?: number;
  printerIp?: string;
  isVoided?: boolean;
  voidedBy?: any;
  createdAt?: Date;
  mpesaTransactionId?: string;
}
