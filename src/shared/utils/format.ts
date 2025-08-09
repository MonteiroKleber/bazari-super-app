export const formatNumber = (
  number: number,
  locale: string = 'pt-BR',
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(locale, options).format(number)
  } catch {
    return number.toString()
  }
}

export const formatCurrency = (
  amount: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string => {
  try {
    if (currency === 'BZR') {
      const formatted = formatNumber(amount, locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      })
      return `${formatted} BZR`
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

export const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address || address.length <= startChars + endChars) {
    return address
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

export const formatFileSize = (bytes: number, locale: string = 'pt-BR'): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  const formatted = formatNumber(size, locale, {
    maximumFractionDigits: 2,
  })

  return `${formatted} ${units[unitIndex]}`
}
