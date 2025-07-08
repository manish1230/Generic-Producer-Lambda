import { SourceOrderData } from "../models/sourceDataModel";
import { TargetOrderModel } from "../models/targetDataModel";
 
export class OrderValidator {
  private static allowedStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  public static validate(record: SourceOrderData): void {
    const errors: string[] = [];

    if (!record || typeof record !== 'object') {
      throw new Error("Record must be a valid object.");
    }

    this.validateOrderFields(record, errors);
    this.validateItems(record, errors);
    this.validateShipping(record, errors);
    this.validateOptionalFields(record, errors);

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }

  private static validateOrderFields(record: SourceOrderData, errors: string[]): void {
    if (!record.orderId || typeof record.orderId !== 'string') {
      errors.push("Invalid or missing 'orderId'.");
    }

    if (!record.orderDate || typeof record.orderDate !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(record.orderDate) || !this.isRealDate(record.orderDate)) {
      errors.push("Invalid or missing 'orderDate'. Expected format: MM/DD/YYYY.");
    }

    if (!record.customerId || typeof record.customerId !== 'string') {
      errors.push("Invalid or missing 'customerId'.");
    }

    if (typeof record.storeId !== 'number') {
      errors.push("Invalid or missing 'storeId'. Must be a number.");
    }

    if (!record.paymentMethod || typeof record.paymentMethod !== 'string') {
      errors.push("Invalid or missing 'paymentMethod'.");
    }

    if (typeof record.totalAmount !== 'number' || record.totalAmount < 0) {
      errors.push("Invalid or missing 'totalAmount'. Must be a non-negative number.");
    }

    if (!record.status || typeof record.status !== 'string' || !this.allowedStatuses.includes(record.status)) {
      errors.push(`Invalid or missing 'status'. Must be one of: ${this.allowedStatuses.join(', ')}.`);
    }
  }

  private static validateItems(record: SourceOrderData, errors: string[]): void {
    if (!Array.isArray(record.items) || record.items.length === 0) {
      errors.push("Missing or empty 'items' array.");
    } else {
      record.items.forEach((item, idx) => {
        if (!item.sku || typeof item.sku !== 'string') {
          errors.push(`Invalid or missing 'sku' in item ${idx + 1}.`);
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          errors.push(`Invalid or missing 'quantity' in item ${idx + 1}.`);
        }
        if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
          errors.push(`Invalid or missing 'unitPrice' in item ${idx + 1}.`);
        }
        if ('discountAmount' in item && typeof item.discountAmount !== 'number') {
          errors.push(`'discountAmount' in item ${idx + 1} must be a number if provided.`);
        }
      });
    }
  }

  private static validateShipping(record: SourceOrderData, errors: string[]): void {
    if (record.shippingAddress) {
      const addr = record.shippingAddress;
      ['street', 'city', 'state', 'zipCode', 'country'].forEach(field => {
        if (!addr[field as keyof typeof addr] || typeof addr[field as keyof typeof addr] !== 'string') {
          errors.push(`Invalid or missing '${field}' in 'shippingAddress'.`);
        }
      });
    }
  }

  private static validateOptionalFields(record: SourceOrderData, errors: string[]): void {
    if ('notes' in record && typeof record.notes !== 'string') {
      errors.push("'notes' must be a string if provided.");
    }
  }

  private static isRealDate(dateStr: string): boolean {
  const [monthStr, dayStr, yearStr] = dateStr.split('/');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  const date = new Date(year, month - 1, day); // JS months are 0-indexed

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

}


