import React, { FC } from 'react'
import { useBashProduct } from './BashProductDataProvider'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'installmentsContainer',
  'installmentsText',
  'installmentsNumber',
  'installmentsValue',
] as const

interface BashProductInstallmentsProps {
  message?: string
  markers?: string[]
  blockClass?: string
}

const BashProductInstallments: FC<BashProductInstallmentsProps> = ({
  message = 'or {installmentsNumber}x of {installmentsValue}',
  blockClass = '',
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const productContext = useBashProduct() as any

  const selectedItem = productContext?.selectedItem
  const installments = selectedItem?.sellers?.[0]?.commertialOffer?.Installments

  console.log('🚀 BASH PRODUCT INSTALLMENTS - Debug Info')
  console.log('ProductContext:', productContext)
  console.log('SelectedItem:', selectedItem)
  console.log('Installments:', installments)

  if (!installments || installments.length === 0) {
    return null
  }

  // Get the installment with the maximum number of installments
  const maxInstallment = installments.reduce((max: any, current: any) => {
    return current.NumberOfInstallments > max.NumberOfInstallments ? current : max
  }, installments[0])

  if (!maxInstallment || maxInstallment.NumberOfInstallments <= 1) {
    return null
  }

  const installmentValue = maxInstallment.Value
  const numberOfInstallments = maxInstallment.NumberOfInstallments

  // Format the installment value
  const formattedValue = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(installmentValue)

  // Replace placeholders in message
  const displayMessage = message
    .replace('{installmentsNumber}', String(numberOfInstallments))
    .replace('{installmentsValue}', formattedValue)

  return (
    <div className={`${handles.installmentsContainer} ${blockClass}`}>
      <span className={handles.installmentsText}>{displayMessage}</span>
    </div>
  )
}

export default BashProductInstallments
