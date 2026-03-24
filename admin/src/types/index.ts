// 全局类型定义

export interface Product {
  id: number
  name: string
  image: string
  category: string
  price: number
  stock: number
  sales: number
  status: 'active' | 'inactive'
}

export interface Order {
  orderNo: string
  userName: string
  products: string[]
  amount: number
  status: 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled'
  createTime: string
}

export interface User {
  id: number
  avatar: string
  username: string
  phone: string
  orderCount: number
  totalAmount: number
  status: 'active' | 'disabled'
  createTime: string
}

export interface Category {
  id: number
  name: string
  icon: string
  sort: number
  productCount: number
  status: 'active' | 'inactive'
}
