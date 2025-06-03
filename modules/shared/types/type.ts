export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  nameProduct: string
  descriptionProduct: string
  imageUrlProduct: string
  priceProduct: number
  productWeight: string
  quantityProduct: number
  typeProducts: string
  categoryId: number
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
  product_id: number
  product_name: string
  user: {
    id: number
    name: string
    email: string
  }
  rating: number
  text: string
  created_at: string
  is_moderate: boolean
  moderation_status: string
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
