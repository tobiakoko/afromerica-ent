import axios, { AxiosInstance, AxiosError } from 'axios'
import type { ApiResponse } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available (only in browser)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        const message = this.getErrorMessage(error)
        return Promise.reject(new Error(message))
      }
    )
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      return (error.response.data as any)?.message || 'An error occurred'
    }
    if (error.request) {
      return 'No response from server'
    }
    return error.message || 'An error occurred'
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params })
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data)
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data)
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url)
  }
}

export const apiClient = new ApiClient()