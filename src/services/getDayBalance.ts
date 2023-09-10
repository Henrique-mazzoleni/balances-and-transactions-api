export type BalanceData = {
  amount: number;
  currency: string;
  date: string;
};

export type TransactionData = {
  amount: number;
  currency: string;
  date: string;
  status: 'BOOKED' | 'CANCELLED' | 'PROCESSED';
};

// this function returns the balance at the end of a target date given the balance in a current day and the transactions in between
export default function getDayBalance(
  balance: BalanceData,
  transactions: TransactionData[],
  date: Date
): BalanceData {
  const newAmount = transactions
    .filter(
      (transaction) =>
        new Date(transaction.date) < new Date(balance.date) &&
        new Date(transaction.date) > date
    )
    .reduce(
      (acc, currTransaction) => acc - currTransaction.amount,
      balance.amount
    );

  return {
    amount: newAmount,
    currency: balance.currency,
    date: date.toISOString(),
  };
}

export function validDate(year: number, month: number, day: number): boolean {
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  const now = new Date();

  // check if date is in the future
  if (now < new Date(year, month, day)) return false;

  // invalid month
  if (month > 11) return false;

  // invalid day
  if ([0, 2, 4, 6, 7, 9, 11].includes(month)) return day <= 31;
  if ([3, 5, 8, 10].includes(month)) return day <= 30;
  return isLeap ? day <= 29 : day <= 28;
}