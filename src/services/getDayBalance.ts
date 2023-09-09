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
  let currBalance = balance.amount;
  let currDate = new Date(balance.date);

  // setting the target date to the end of the day;
  // date.setDate(date.getDate() + 1);
  // date.setTime(date.getTime() - 1);

  // sums the daily amount until the required date has been reached
  while (currDate > date) {
    // clones the current date before transforming to the previous day
    const prevDay = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate()
    );
    prevDay.setDate(prevDay.getDate() - 1);

    // reduces the daily transactions and adds to the current balance
    currBalance = transactions
      .filter(
        (transaction) =>
          new Date(transaction.date) < currDate &&
          new Date(transaction.date) > prevDay
      )
      .reduce(
        (acc, currTransaction) => acc - currTransaction.amount,
        currBalance
      );

    currDate = prevDay;
  }

  return {
    amount: currBalance,
    currency: balance.currency,
    date: date.toISOString(),
  };
}
