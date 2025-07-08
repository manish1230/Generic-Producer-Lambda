"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTransformer = void 0;
class OrderTransformer {
    static transform(record) {
        var _a, _b, _c, _d, _e;
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
                        line1: ((_a = record.shippingAddress) === null || _a === void 0 ? void 0 : _a.street) || '',
                        city: ((_b = record.shippingAddress) === null || _b === void 0 ? void 0 : _b.city) || '',
                        state: ((_c = record.shippingAddress) === null || _c === void 0 ? void 0 : _c.state) || '',
                        postalCode: ((_d = record.shippingAddress) === null || _d === void 0 ? void 0 : _d.zipCode) || '',
                        country: ((_e = record.shippingAddress) === null || _e === void 0 ? void 0 : _e.country) || ''
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
    static formatDate(dateStr) {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
}
exports.OrderTransformer = OrderTransformer;
