export interface Category {
  id: number
  nameCategory: string
  descriptionCategory: string
}

export interface Product {
  id: number
  nameProduct: string
  descriptionProduct: string
  imgUrlProduct: string
  priceProduct: number
  metal: string
  sizeProduct: number[]
  category: {
    id: number
    nameCategory: string
  }
}

export interface AddedProduct {
  nameProduct: string
  descriptionProduct: string
  priceProduct: number
  typeProducts: string
  productWeight: string
  quantityProduct: number
  imageUrl: string
  categoryId: number
}

export interface Review {
  id: number
  createdAt: string
  moderated: boolean
  numberTone: number
  rating: number
  textReview: string
  user: {
    id: number
    fullName: string
    email: string
  }
}

export interface OrderItems {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: number
  createdAt: string
  status: string
  phone: string
  totalQuantity: number
  totalAmount: number
  userId: number
  userEmail: string
  userName: string
  items: OrderItems[]
}
