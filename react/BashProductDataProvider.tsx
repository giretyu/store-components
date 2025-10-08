import React, { FC, useMemo } from 'react'
import BashProductContextProvider from 'thefoschini.bash-product-context/BashProductContextProvider'
import useProduct from 'thefoschini.bash-product-context/useProduct'
import { useRuntime } from 'vtex.render-runtime'

interface BashProductDataProviderProps {
  children: React.ReactNode
}

const API_BASE_URL = 'https://be1160c66d5b.ngrok-free.app'

/**
 * Extract product slug from URL path
 * Handles patterns like: /product-slug/p or /product-slug-123/p
 */
const extractSlugFromPath = (path: string): string | null => {
  // Match pattern: /anything/p where "anything" is the slug
  const match = path.match(/\/([^/]+)\/p\/?$/)
  return match ? match[1] : null
}

const BashProductDataProvider: FC<BashProductDataProviderProps> = ({ children }) => {
  const { query, route } = useRuntime()
  
  // Extract slug with priority: query param > URL path > route params
  const productSlug = useMemo(() => {
    // 1. Check for query parameter (for testing on 404 pages)
    if (query?.slug && typeof query.slug === 'string') {
      return query.slug
    }

    // 2. Try to extract from URL path
    if (route?.path) {
      const slugFromPath = extractSlugFromPath(route.path)
      if (slugFromPath) {
        return slugFromPath
      }
    }

    // 3. Check route params (if VTEX provides slug in params)
    if (route?.params?.slug) {
      return route.params.slug
    }

    return null
  }, [query?.slug, route?.path, route?.params?.slug])

  // Enable debug mode with ?debug=true
  const isDebugMode = query?.debug === 'true' || query?.debug === '1'

  if (isDebugMode) {
    console.log('🚀 BASH PRODUCT DATA PROVIDER [DEBUG]:')
    console.log('  - Query:', query)
    console.log('  - Route:', route)
    console.log('  - Extracted slug:', productSlug)
    console.log('  - API URL:', API_BASE_URL)
  }

  return (
    <BashProductContextProvider 
      productSlug={productSlug}
      apiBaseUrl={API_BASE_URL}
      query={query}
      debug={isDebugMode}
    >
      {children}
    </BashProductContextProvider>
  )
}

// Re-export the useProduct hook from bash-product-context as useBashProduct
export const useBashProduct = useProduct

export default BashProductDataProvider
