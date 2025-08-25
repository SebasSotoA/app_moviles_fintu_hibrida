import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DatabaseAccount,
  DatabaseCategory,
  DatabaseTransaction,
  DatabaseTransfer,
  IDatabaseService
} from './index';

class WebDatabaseService implements IDatabaseService {
  private storageKey = 'fintu_app_data';

  private async getData() {
    const defaultData = {
      accounts: [],
      categories: [],
      transactions: [],
      transfers: []
    };
    
    // Intentar localStorage primero (web)
    if (typeof localStorage !== 'undefined') {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (!data) {
          return defaultData;
        }
        
        const parsed = JSON.parse(data);
        return parsed;
      } catch (error) {
        console.error('Error with localStorage:', error);
      }
    }
    
    // Fallback a AsyncStorage (móvil)
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      if (!data) {
        return defaultData;
      }
      
      const parsed = JSON.parse(data);
      return parsed;
    } catch (error) {
      console.error('Error with AsyncStorage:', error);
      return defaultData;
    }
  }

  private async saveData(data: any) {
    // Intentar localStorage primero (web)
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        return;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    // Fallback a AsyncStorage (móvil)
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  }

  async init(): Promise<void> {
    await this.insertDefaultData();
  }

  private async insertDefaultData(): Promise<void> {
    const data = await this.getData();
    
    if (data.accounts.length === 0) {
      const now = new Date().toISOString();
      data.accounts.push({
        id: 'default-account',
        name: 'Cuenta 1',
        balance: 50000,
        currency: 'COP',
        symbol: '💰',
        color: '#3A7691',
        includeInTotal: true,
        createdAt: now,
        updatedAt: now
      });
    }

    if (data.categories.length === 0) {
      const now = new Date().toISOString();
      const defaultCategories = [
        // Categorías de gastos
        ['cat-food', 'Comida', 'restaurant-outline', '#FF6B6B', 'GASTO', false, null],
        ['cat-transport', 'Transporte', 'car-outline', '#4ECDC4', 'GASTO', false, null],
        ['cat-entertainment', 'Entretenimiento', 'game-controller-outline', '#45B7D1', 'GASTO', false, null],
        ['cat-health', 'Salud', 'medical-outline', '#96CEB4', 'GASTO', false, null],
        ['cat-education', 'Educación', 'school-outline', '#FFEAA7', 'GASTO', false, null],
        ['cat-services', 'Servicios', 'receipt-outline', '#DDA0DD', 'GASTO', false, null],
        
        // Categorías de ingresos
        ['cat-salary', 'Salario', 'briefcase-outline', '#4CAF50', 'INGRESO', false, null],
        ['cat-freelance', 'Freelance', 'laptop-outline', '#FF9800', 'INGRESO', false, null],
        ['cat-investments', 'Inversiones', 'trending-up-outline', '#9C27B0', 'INGRESO', false, null],
        ['cat-gift', 'Regalo', 'gift-outline', '#E91E63', 'INGRESO', false, null],
        ['cat-other', 'Otros', 'add-circle-outline', '#607D8B', 'INGRESO', false, null],
      ];

      for (const category of defaultCategories) {
        data.categories.push({
          id: category[0],
          name: category[1],
          icon: category[2],
          color: category[3],
          type: category[4],
          isMonthlyExpense: category[5],
          monthlyAmount: category[6],
          createdAt: now,
          updatedAt: now
        });
      }
    }

    await this.saveData(data);
  }

  async getAccounts(): Promise<DatabaseAccount[]> {
    const data = await this.getData();
    const accounts = data.accounts || [];
    return accounts;
  }

  async getAccountById(id: string): Promise<DatabaseAccount | null> {
    const data = await this.getData();
    return data.accounts.find((acc: any) => acc.id === id) || null;
  }

  async createAccount(account: Omit<DatabaseAccount, 'createdAt' | 'updatedAt'>): Promise<void> {
    const data = await this.getData();
    const now = new Date().toISOString();
    data.accounts.push({
      ...account,
      createdAt: now,
      updatedAt: now
    });
    await this.saveData(data);
  }

  async updateAccount(id: string, updates: Partial<Omit<DatabaseAccount, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const data = await this.getData();
    const accountIndex = data.accounts.findIndex((acc: any) => acc.id === id);
    if (accountIndex !== -1) {
      const now = new Date().toISOString();
      data.accounts[accountIndex] = {
        ...data.accounts[accountIndex],
        ...updates,
        updatedAt: now
      };
      await this.saveData(data);
    }
  }

  async getCategories(): Promise<DatabaseCategory[]> {
    const data = await this.getData();
    return data.categories || [];
  }

  async getCategoriesByType(type: 'GASTO' | 'INGRESO'): Promise<DatabaseCategory[]> {
    const data = await this.getData();
    return (data.categories || []).filter((cat: any) => cat.type === type);
  }

  async createCategory(category: Omit<DatabaseCategory, 'createdAt' | 'updatedAt'>): Promise<void> {
    const data = await this.getData();
    const now = new Date().toISOString();
    data.categories.push({
      ...category,
      createdAt: now,
      updatedAt: now
    });
    await this.saveData(data);
  }

  async getTransactions(): Promise<DatabaseTransaction[]> {
    const data = await this.getData();
    return data.transactions || [];
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<DatabaseTransaction[]> {
    const data = await this.getData();
    return (data.transactions || []).filter((tx: any) => 
      tx.date >= startDate && tx.date <= endDate
    );
  }

  async createTransaction(transaction: Omit<DatabaseTransaction, 'createdAt' | 'updatedAt'>): Promise<void> {
    const data = await this.getData();
    const now = new Date().toISOString();
    
    // Insertar transacción
    data.transactions.push({
      ...transaction,
      createdAt: now,
      updatedAt: now
    });

    // Actualizar balance de la cuenta
    const accountIndex = data.accounts.findIndex((acc: any) => acc.id === transaction.accountId);
    if (accountIndex !== -1) {
      const balanceChange = transaction.type === 'INGRESO' ? transaction.amount : -transaction.amount;
      data.accounts[accountIndex].balance += balanceChange;
      data.accounts[accountIndex].updatedAt = now;
    }

    await this.saveData(data);
  }

  async createTransfer(transfer: Omit<DatabaseTransfer, 'createdAt' | 'updatedAt'>): Promise<void> {
    const data = await this.getData();
    const now = new Date().toISOString();
    
    // Insertar transferencia
    data.transfers.push({
      ...transfer,
      createdAt: now,
      updatedAt: now
    });

    // Actualizar balances
    const fromAccountIndex = data.accounts.findIndex((acc: any) => acc.id === transfer.fromAccountId);
    const toAccountIndex = data.accounts.findIndex((acc: any) => acc.id === transfer.toAccountId);
    
    if (fromAccountIndex !== -1) {
      data.accounts[fromAccountIndex].balance -= transfer.amount;
      data.accounts[fromAccountIndex].updatedAt = now;
    }
    
    if (toAccountIndex !== -1) {
      data.accounts[toAccountIndex].balance += transfer.amount;
      data.accounts[toAccountIndex].updatedAt = now;
    }

    await this.saveData(data);
  }

  async getTransactionStats(startDate: string, endDate: string, type?: 'GASTO' | 'INGRESO'): Promise<any[]> {
    const data = await this.getData();
    const transactions = (data.transactions || []).filter((tx: any) => 
      tx.date >= startDate && tx.date <= endDate && (!type || tx.type === type)
    );

    const categories = data.categories || [];
    const stats: any = {};

    // Agrupar por categoría
    transactions.forEach((tx: any) => {
      if (!stats[tx.categoryId]) {
        const category = categories.find((cat: any) => cat.id === tx.categoryId);
        if (category) {
          stats[tx.categoryId] = {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            totalAmount: 0,
            transactionCount: 0
          };
        }
      }
      
      if (stats[tx.categoryId]) {
        stats[tx.categoryId].totalAmount += tx.amount;
        stats[tx.categoryId].transactionCount++;
      }
    });

    return Object.values(stats).filter((stat: any) => stat.totalAmount > 0);
  }
}

const databaseService = new WebDatabaseService();
export { databaseService };

