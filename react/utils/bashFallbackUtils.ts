import { useState, useEffect } from 'react'

/**
 * THIS FILE IS DEPRECATED AND SHOULD NOT BE USED
 * 
 * The dynamic require() approach causes VTEX IO build crashes.
 * Use BashProductDataProvider.tsx instead for proper BASH product context integration.
 * 
 * Safe fallback configuration for BASH Product Context
 * 
 * This file provides utilities to safely handle fallbacks between
 * BASH product context and standard VTEX product context
 */

export interface FallbackConfig {
  enableBashContext: boolean
  enableDebugLogging: boolean
  fallbackTimeout: number
  preferBashContext: boolean
}

// Type for runtime window object
declare global {
  interface Window {
    __RUNTIME__?: {
      production?: boolean
    }
  }
}

// Environment-based configuration
export const getFallbackConfig = (): FallbackConfig => {
  const isProduction = (typeof window !== 'undefined' && window?.__RUNTIME__?.production) ?? true
  
  return {
    enableBashContext: true, // Always enabled
    enableDebugLogging: !isProduction, // Only in dev/staging
    fallbackTimeout: 3000, // 3 second timeout for BASH API
    preferBashContext: true // Try BASH first, fallback to VTEX
  }
}

/**
 * @deprecated Use BashProductDataProvider and standard hooks instead
 * Safe hook wrapper that handles errors and provides fallback
 */
export const useSafeProductContext = () => {
  console.warn('⚠️ useSafeProductContext is deprecated and may cause build errors. Use BashProductDataProvider instead.')
  
  return {
    product: null,
    source: 'none' as const,
    hasError: true,
    error: new Error('This hook is deprecated')
  }
}

/**
 * @deprecated Not needed with BashProductDataProvider approach
 * Emergency disable mechanism for production issues
 */
export const useEmergencyFallbackControl = () => {
  const [emergencyDisabled, setEmergencyDisabled] = useState(false)
  
  useEffect(() => {
    console.warn('⚠️ useEmergencyFallbackControl is deprecated.')
    return undefined
  }, [])

  return { emergencyDisabled, setEmergencyDisabled }
}