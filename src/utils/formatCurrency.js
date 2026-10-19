const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return ''
  return usd.format(Number(value))
}
