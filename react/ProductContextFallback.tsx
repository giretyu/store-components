import React, { createContext, useContext, ReactNode } from 'react'

/**
 * THIS FILE IS DEPRECATED AND SHOULD NOT BE USED
 * 
 * Use BashProductDataProvider.tsx instead for BASH product context integration.
 * This file caused build issues with dynamic requires in VTEX IO.
 */

interface FallbackConfig {
  enableBashContext: boolean
  enableLogging: boolean
  fallbackTimeout: number
  apiBaseUrl?: string
}

interface FallbackContextValue {
  config: FallbackConfig
  updateConfig: (newConfig: Partial<FallbackConfig>) => void
}

const FallbackContext = createContext<FallbackContextValue | null>(null)

interface ProductContextFallbackProviderProps {
  children: ReactNode
  config?: Partial<FallbackConfig>
}

const defaultConfig: FallbackConfig = {
  enableBashContext: true,
  enableLogging: false,
  fallbackTimeout: 5000,
  apiBaseUrl: process.env.BASH_API_BASE_URL
}

/**
 * @deprecated Use BashProductDataProvider instead
 */
export const ProductContextFallbackProvider: React.FC<ProductContextFallbackProviderProps> = ({
  children,
  config: initialConfig = {}
}) => {
  const [config, setConfig] = React.useState<FallbackConfig>({
    ...defaultConfig,
    ...initialConfig
  })

  const updateConfig = React.useCallback((newConfig: Partial<FallbackConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  const value = React.useMemo(() => ({
    config,
    updateConfig
  }), [config, updateConfig])

  return (
    <FallbackContext.Provider value={value}>
      {children}
    </FallbackContext.Provider>
  )
}

/**
 * @deprecated Use BashProductDataProvider and the standard hooks instead
 * Safe product context hook with automatic fallback
 * Priority: BASH Context -> VTEX Context -> null
 */
export const useProductWithFallback = () => {
  const fallbackContext = useContext(FallbackContext)

  if (fallbackContext) {
    console.warn('⚠️ useProductWithFallback is deprecated. Use BashProductDataProvider instead.')
  }

  return {
    context: null,
    source: 'none' as const,
    isLoading: false,
    error: new Error('This hook is deprecated')
  }
}

/**
 * @deprecated Use BashProductDataProvider instead
 * HOC to wrap any component with safe product context fallback
 */
export const withProductContextFallback = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    displayName?: string
    enableLogging?: boolean
  }
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { context, source, isLoading, error } = useProductWithFallback()
    
    if (options?.enableLogging) {
      console.log(`🚀 BASH FALLBACK [${options.displayName || Component.displayName || 'Component'}]:`, {
        source,
        hasProduct: !!context,
        isLoading,
        error
      })
    }

    // Pass the context and metadata to the component
    return (
      <Component
        {...props}
        productContext={context}
        contextSource={source}
        isLoading={isLoading}
        contextError={error}
      />
    )
  }

  WrappedComponent.displayName = `withProductContextFallback(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook for components that need to know which context source is active
 */
export const useProductContextSource = () => {
  const { source } = useProductWithFallback()
  return source
}

/**
 * Emergency fallback configuration (for production issues)
 */
export const useFallbackConfig = () => {
  const fallbackContext = useContext(FallbackContext)
  
  if (!fallbackContext) {
    throw new Error('useFallbackConfig must be used within ProductContextFallbackProvider')
  }
  
  return fallbackContext
}