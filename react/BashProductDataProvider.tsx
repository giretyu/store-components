import React, { FC, useState, useEffect, createContext, useContext } from 'react'
import { ProductContext } from 'thefoschini.bash-product-context'

interface BashProductDataProviderProps {
  children: React.ReactNode
}

interface ApiResponse {
  data: any[]
  success: boolean
}

interface ProductContextValue {
  product: any
  selectedItem: any
  selectedQuantity: number
  skuSelector: {
    isVisible: boolean
    areAllVariationsSelected: boolean
    selectedImageVariationSKU: string | null
  }
  buyButton: {
    clicked: boolean
  }
  assemblyOptions: {
    items: Record<string, any[]>
    inputValues: Record<string, any>
    areGroupsValid: Record<string, boolean>
  }
}

const BashProductContext = createContext<ProductContextValue | undefined>(undefined)

export const useBashProduct = () => useContext(BashProductContext)

const API_BASE_URL = 'https://be1160c66d5b.ngrok-free.app'
const HARDCODED_SLUG = 'ts-mens-summit-marathon-lime-run-jacket-130609adpq6'

const BashProductDataProvider: FC<BashProductDataProviderProps> = ({ children }) => {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only fetch in browser, not during SSR
    if (typeof window === 'undefined') {
      console.log('🚀 BASH PRODUCT DATA PROVIDER: Skipping fetch - running on server')
      setLoading(false)
      return
    }

    console.log('🚀 BASH PRODUCT DATA PROVIDER: Fetching product...')
    
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/products/product/vtex/${HARDCODED_SLUG}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        const data: ApiResponse = await response.json()
        console.log('🚀 BASH PRODUCT DATA PROVIDER: API Response:', data)
        
        if (data.success && data.data?.[0]) {
          console.log('🚀 BASH PRODUCT DATA PROVIDER: Setting product:', data.data[0])
          setProduct(data.data[0])
        }
      } catch (error) {
        console.error('🚀 BASH PRODUCT DATA PROVIDER: Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

  const contextValue: ProductContextValue = {
    product,
    selectedItem: product?.items?.[0] || null,
    selectedQuantity: 1,
    skuSelector: {
      isVisible: true,
      areAllVariationsSelected: false,
      selectedImageVariationSKU: null,
    },
    buyButton: {
      clicked: false,
    },
    assemblyOptions: {
      items: {},
      inputValues: {},
      areGroupsValid: {},
    },
  }

  if (loading) {
    console.log('🚀 BASH PRODUCT DATA PROVIDER: Loading...')
    return <div>Loading product data...</div>
  }

  console.log('🚀 BASH PRODUCT DATA PROVIDER: Rendering with context:', contextValue)

  return (
    <BashProductContext.Provider value={contextValue}>
      <ProductContext.Provider value={contextValue}>
        {children}
      </ProductContext.Provider>
    </BashProductContext.Provider>
  )
}

export default BashProductDataProvider
