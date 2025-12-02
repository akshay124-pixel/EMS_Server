import DataLoader from 'dataloader';
import { employeeService } from '../services/employeeService.js';

/**
 * Create DataLoaders for batching and caching
 * Prevents N+1 query problems
 */
export const createDataLoaders = () => {
  return {
    employeeLoader: new DataLoader(async (ids) => {
      // Batch load employees by IDs
      const employees = await Promise.all(
        ids.map(id => employeeService.getEmployeeById(id).catch(() => null))
      );
      return employees;
    }, {
      cache: true,
      maxBatchSize: 100
    })
  };
};
