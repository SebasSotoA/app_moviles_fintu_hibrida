// Interfaces compartidas
export interface DatabaseAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  symbol: string;
  color: string;
  includeInTotal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'GASTO' | 'INGRESO';
  isMonthlyExpense: boolean;
  monthlyAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseTransaction {
  id: string;
  accountId: string;
  categoryId: string;
  type: 'GASTO' | 'INGRESO';
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface común para el servicio
export interface IDatabaseService {
  init(): Promise<void>;
  
  // Cuentas
  getAccounts(): Promise<DatabaseAccount[]>;
  getAccountById(id: string): Promise<DatabaseAccount | null>;
  createAccount(account: Omit<DatabaseAccount, 'createdAt' | 'updatedAt'>): Promise<void>;
  updateAccount(id: string, updates: Partial<Omit<DatabaseAccount, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void>;
  
  // Categorías
  getCategories(): Promise<DatabaseCategory[]>;
  getCategoriesByType(type: 'GASTO' | 'INGRESO'): Promise<DatabaseCategory[]>;
  createCategory(category: Omit<DatabaseCategory, 'createdAt' | 'updatedAt'>): Promise<void>;
  updateCategory(id: string, updates: Partial<Omit<DatabaseCategory, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void>;
  
  // Transacciones
  getTransactions(): Promise<DatabaseTransaction[]>;
  getTransactionsByDateRange(startDate: string, endDate: string): Promise<DatabaseTransaction[]>;
  createTransaction(transaction: Omit<DatabaseTransaction, 'createdAt' | 'updatedAt'>): Promise<void>;
  
  // Transferencias
  createTransfer(transfer: Omit<DatabaseTransfer, 'createdAt' | 'updatedAt'>): Promise<void>;
  
  // Estadísticas
  getTransactionStats(startDate: string, endDate: string, type?: 'GASTO' | 'INGRESO', accountId?: string): Promise<any[]>;
}

// Re-exportar el servicio de localStorage para todas las plataformas
export { databaseService } from './databaseService.web';
