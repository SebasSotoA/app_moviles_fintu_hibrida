import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DatabaseAccount, DatabaseCategory, databaseService, DatabaseTransaction } from '../services/database';

interface AppContextType {
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Data
  accounts: DatabaseAccount[];
  categories: DatabaseCategory[];
  currentAccount: DatabaseAccount | null;
  
  // Actions
  addTransaction: (transaction: Omit<DatabaseTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addAccount: (account: Omit<DatabaseAccount, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addCategory: (category: Omit<DatabaseCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Omit<DatabaseCategory, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setCurrentAccount: (accountId: string) => void;
  refreshData: () => Promise<void>;
  getTransactionStats: (startDate: string, endDate: string, type?: 'GASTO' | 'INGRESO', accountId?: string) => Promise<any[]>;
  getTransactionsByDateRange: (startDate: string, endDate: string) => Promise<DatabaseTransaction[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [accounts, setAccounts] = useState<DatabaseAccount[]>([]);
  const [categories, setCategories] = useState<DatabaseCategory[]>([]);
  const [currentAccount, setCurrentAccountState] = useState<DatabaseAccount | null>(null);

  // Inicializar la base de datos
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      await databaseService.init();
      await refreshData();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await databaseService.deleteCategory(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const updateCategory = async (
    id: string,
    updates: Partial<Omit<DatabaseCategory, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      await databaseService.updateCategory(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    try {
      const [accountsData, categoriesData] = await Promise.all([
        databaseService.getAccounts(),
        databaseService.getCategories()
      ]);
      
      setAccounts(accountsData);
      setCategories(categoriesData);
      
      // Sincronizar la cuenta actual con los datos más recientes
      if (accountsData.length > 0) {
        if (!currentAccount) {
          setCurrentAccountState(accountsData[0]);
        } else {
          const updated = accountsData.find(acc => acc.id === currentAccount.id);
          if (updated) setCurrentAccountState(updated);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const addTransaction = async (transactionData: Omit<DatabaseTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await databaseService.createTransaction({
        ...transactionData,
        id: transactionId
      });
      await refreshData(); // Refrescar para actualizar balances
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const addAccount = async (accountData: Omit<DatabaseAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const accountId = `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await databaseService.createAccount({
        ...accountData,
        id: accountId
      });
      await refreshData();
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  };

  const addCategory = async (categoryData: Omit<DatabaseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await databaseService.createCategory({
        ...categoryData,
        id: categoryId
      });
      await refreshData();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const setCurrentAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setCurrentAccountState(account);
    }
  };

  const getTransactionStats = async (startDate: string, endDate: string, type?: 'GASTO' | 'INGRESO', accountId?: string) => {
    try {
      return await databaseService.getTransactionStats(startDate, endDate, type, accountId);
    } catch (error) {
      console.error('Error getting transaction stats:', error);
      return [];
    }
  };

  const getTransactionsByDateRange = async (startDate: string, endDate: string) => {
    try {
      return await databaseService.getTransactionsByDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error getting transactions by date range:', error);
      return [];
    }
  };

  const value: AppContextType = {
    isLoading,
    isInitialized,
    accounts,
    categories,
    currentAccount,
    addTransaction,
    addAccount,
    addCategory,
    updateCategory,
    deleteCategory,
    setCurrentAccount,
    refreshData,
    getTransactionStats,
    getTransactionsByDateRange
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
