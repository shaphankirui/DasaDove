export interface Quotation {
  createdAt: string | number | Date;
  id: number;
  referenceNumber: string;
  supplierId: number;
  items: any;
  totalAmount: number;
  status: string;
}
