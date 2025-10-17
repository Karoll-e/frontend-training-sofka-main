// src/services/accountGenerator.service.ts
import cuentaService from './cuenta.service';

export class AccountGeneratorService {
  /**
   * Generates a unique account number
   * Format: XXXXXXXXXXXX (12 digits)
   */
  private generateAccountNumber(): string {
    // Generate 12 random digits
    let accountNumber = '';
    for (let i = 0; i < 12; i++) {
      accountNumber += Math.floor(Math.random() * 10).toString();
    }
    return accountNumber;
  }

  /**
   * Validates if account number already exists
   */
  private async isAccountNumberUnique(accountNumber: string): Promise<boolean> {
    try {
      const existingAccount = await cuentaService.findByNumeroCuenta(accountNumber);
      return existingAccount === null;
    } catch (error) {
      console.error('Error checking account uniqueness:', error);
      return false;
    }
  }

  /**
   * Generates a unique account number with validation
   * Retries up to maxAttempts times if duplicates are found
   */
  async generateUniqueAccountNumber(): Promise<string> {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const accountNumber = this.generateAccountNumber();
      const isUnique = await this.isAccountNumberUnique(accountNumber);
      
      if (isUnique) {
        return accountNumber;
      }
      
      attempts++;
    }

    throw new Error('Unable to generate unique account number after multiple attempts');
  }
}

export default new AccountGeneratorService();
