export interface Quotation {
  id: number;
  referenceNumber: string;
  supplierId: number;
  items: any;
  totalAmount: number;
  status: string;
}
