import { SourceOrderData } from "../models/sourceDataModel";
import { TargetOrderModel } from "../models/targetDataModel";



export class OrderTransformer {
  
  public static transform(record: SourceOrderData): TargetOrderModel {
    const formattedDate = this.formatDate(record.orderDate);
    const processedAt = new Date().toISOString();

    return {
      order: {
        id: record.orderId,
        createdAt: formattedDate,
        customer: { id: record.customerId },
        location: { storeId: String(record.storeId) },
        status: record.status.toLowerCase(),
        payment: {
          method: record.paymentMethod,
          total: record.totalAmount
        },
        shipping: {
          address: {
            line1: record.shippingAddress?.street || '',
            city: record.shippingAddress?.city || '',
            state: record.shippingAddress?.state || '',
            postalCode: record.shippingAddress?.zipCode || '',
            country: record.shippingAddress?.country || ''
          }
        }
      },
      items: record.items.map(item => {
        const base = item.unitPrice;
        const discount = item.discountAmount || 0;
        const final = (base - discount) * item.quantity;

        return {
          productId: item.sku,
          quantity: item.quantity,
          price: {
            base,
            discount,
            final: parseFloat(final.toFixed(2))
          }
        };
      }),
      metadata: {
        source: "order_producer",
        notes: record.notes || "",
        processedAt
      }
    };
  }

  private static formatDate(dateStr: string): string {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

