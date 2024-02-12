export interface OrderReport {
    orders: Order[]
    total: number
    skip: number
    limit: number
}

export interface Order {
    orderId: number
    orderDate: string
    billNumber: string
    total: number
    orderStatus: string
    paymentType: string
    orderBy: string
    orderItems: OrderItem[]
}

export interface OrderItem {
    productId: number
    productName: string
    price: number
    quantity: number
    amount: number
}
