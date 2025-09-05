import { databaseService, DatabaseTransaction } from './database';

/**
 * Servicio de transacciones que extiende la funcionalidad existente
 * sin modificar la estructura de datos principal
 */

export interface TransactionInput {
  id: string;
  type: 'GASTO' | 'INGRESO';
  amount: number;
  description?: string;
  date: string; // ISO string
  categoryId: string;
  accountId: string; // Requerido para mantener compatibilidad
}

/**
 * Agrega una transacción a una categoría específica
 * Utiliza el databaseService.createTransaction existente
 */
export const addTransactionToCategory = async (
  categoryId: string, 
  transaction: Omit<TransactionInput, 'categoryId'>
): Promise<DatabaseTransaction> => {
  try {
    // Validar que la categoría existe
    const categories = await databaseService.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error(`Categoría con ID ${categoryId} no encontrada`);
    }

    // Validar que el tipo de transacción coincida con el tipo de categoría
    if (category.type !== transaction.type) {
      throw new Error(`No puedes crear una transacción de tipo ${transaction.type} en una categoría de tipo ${category.type}`);
    }

    // Crear la transacción usando el servicio existente
    const newTransaction = await databaseService.createTransaction({
      ...transaction,
      categoryId,
    });

    return newTransaction;
  } catch (error) {
    console.error('Error al crear transacción:', error);
    throw error;
  }
};

/**
 * Obtiene todas las transacciones de una categoría específica
 */
export const getTransactionsByCategory = async (categoryId: string): Promise<DatabaseTransaction[]> => {
  try {
    const transactions = await databaseService.getTransactions();
    return transactions.filter(transaction => transaction.categoryId === categoryId);
  } catch (error) {
    console.error('Error al obtener transacciones por categoría:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas de transacciones por categoría
 */
export const getCategoryTransactionStats = async (categoryId: string) => {
  try {
    const transactions = await getTransactionsByCategory(categoryId);
    
    const total = transactions.reduce((sum, transaction) => {
      if (transaction.type === 'GASTO') {
        return sum - transaction.amount;
      } else {
        return sum + transaction.amount;
      }
    }, 0);

    const count = transactions.length;
    const lastTransaction = transactions.length > 0 
      ? transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

    return {
      total,
      count,
      lastTransaction,
      transactions
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de categoría:', error);
    return {
      total: 0,
      count: 0,
      lastTransaction: null,
      transactions: []
    };
  }
};

/**
 * Elimina una transacción por ID
 */
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    await databaseService.deleteTransaction(transactionId);
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de todas las categorías para la pantalla de inicio
 */
export const getAllCategoriesStats = async () => {
  try {
    const categories = await databaseService.getCategories();
    const transactions = await databaseService.getTransactions();
    
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
        
        const total = categoryTransactions.reduce((sum, transaction) => {
          if (transaction.type === 'GASTO') {
            return sum - transaction.amount;
          } else {
            return sum + transaction.amount;
          }
        }, 0);

        const count = categoryTransactions.length;
        const lastTransaction = categoryTransactions.length > 0 
          ? categoryTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          : null;

        return {
          ...category,
          total,
          count,
          lastTransaction
        };
      })
    );

    return categoriesWithStats;
  } catch (error) {
    console.error('Error al obtener estadísticas de todas las categorías:', error);
    return [];
  }
};
