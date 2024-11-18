import { CategoryDTO } from "../categories/category.dto";

export class Expense {
    id: string | undefined; 
    amount: number | undefined; 
    description: string | undefined;
    paymentMethod: PaymentMethod | undefined;
    category: CategoryDTO | undefined; 
    created: string | undefined; 
    lastModified: string | undefined; 

    constructor(
      ) {
       
      }
}

export enum PaymentMethod {
    CARD='Card',
    CASH='Cash',
    CRYPTO='Crypto',
}