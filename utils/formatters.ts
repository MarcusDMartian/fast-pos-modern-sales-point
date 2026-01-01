
export const formatCurrency = (amount: number, currencyConfig: string = 'VND (₫)') => {
    const symbol = currencyConfig.includes('(')
        ? currencyConfig.split('(')[1].replace(')', '')
        : '$';

    const isVND = currencyConfig.includes('VND');

    if (isVND) {
        return `${symbol}${Math.round(amount).toLocaleString('vi-VN')}`;
    }

    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCurrencySymbol = (currencyConfig: string = 'VND (₫)') => {
    return currencyConfig.includes('(')
        ? currencyConfig.split('(')[1].replace(')', '')
        : '$';
};
