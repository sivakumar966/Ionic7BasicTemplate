export interface CategoryWiseStock {
    categoryId: number
    categoryName: string
    displayOrder: number
    imgPath: string
    products: StockProduct[]
  }
  
  export interface StockProduct {
    id: number
    name: string
    price: number
    imgPath: string
    isAvailable: boolean
    stock: number
  }
  