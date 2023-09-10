import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { accessAPIData } from './services/getAPIData';

import type { Request } from 'express';
import getDayBalance, {
  BalanceData,
  TransactionData,
  validDate,
} from './services/getDayBalance';

type QueryParams = {
  from: string;
  to: string;
  sort: 'asc' | 'desc';
};

type ReturnError = {
  errorCode: string;
  description: string;
};

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get(
  '/historical-balances',
  async (req: Request<unknown, unknown, unknown, QueryParams>, res) => {
    // retrieving api key from header
    const apiKey = req.get('x-api-key');
    // retrieving query parameters
    const { from, to, sort } = req.query;

    // validation for missing query parameters
    if (!from || !to || !sort) {
      return res.status(400).json({
        errorCode: 'BAD_REQUEST',
        description: 'Missing query paramaters.',
      });
    }

    // parsing start and end dates from query parameters
    const [fromDay, fromMonth, fromYear]: number[] = from
      .split('-')
      .map(Number);
    const [toDay, toMonth, toYear]: number[] = to.split('-').map(Number);

    const startDate = new Date(Date.UTC(toYear, toMonth - 1, toDay));
    startDate.setDate(startDate.getDate() + 1);
    startDate.setTime(startDate.getTime() - 1);

    const endDate = new Date(Date.UTC(fromYear, fromMonth - 1, fromDay));

    // date validation
    if (
      !fromDay ||
      !fromMonth ||
      !fromYear ||
      !toDay ||
      !toMonth ||
      !toYear ||
      startDate.toString() === 'Invalid Date' ||
      endDate.toString() === 'Invalid Date' ||
      !validDate(fromYear, fromMonth - 1, fromDay) ||
      !validDate(toYear, toMonth - 1, toDay)
    ) {
      return res.status(400).json({
        errorCode: 'BAD_REQUEST',
        description: 'Invalid date.',
      });
    }

    console.log('parsed starting date:', startDate);
    console.log('parsed ending date:', endDate);

    // checking if startDate is before endDate
    if (startDate < endDate) {
      return res.status(400).json({
        errorCode: 'BAD_REQUEST',
        description: 'From date must be after the to date.',
      });
    }

    // validate sorting input
    if (!['asc', 'desc'].includes(sort)) {
      return res.status(400).json({
        errorCode: 'BAD_REQUEST',
        description:
          "Invalid sorting method. select either 'asc' for ascending or 'desc' for descending.",
      });
    }

    try {
      if (apiKey) {
        // getting current balance from provided api
        const currentBalance: BalanceData | ReturnError = await accessAPIData(
          '/balances',
          apiKey
        );

        if ('errorCode' in currentBalance) {
          if (currentBalance.errorCode === 'UNAUTHORIZED') {
            return res.status(401).json(currentBalance);
          }
          return res.status(500).json(currentBalance);
        }

        // validate retrieved balance data
        if (
          !currentBalance.amount ||
          !currentBalance.currency ||
          !currentBalance.date ||
          isNaN(Number(currentBalance.amount)) ||
          new Date(currentBalance.date).toString() === 'Invalid Date'
        ) {
          return res.status(500).json({
            errorCode: 'INTERNAL_SERVER_ERROR',
            description: 'Retrieved corrupted data from API.',
          });
        }

        console.log('Retrieved Balance:', currentBalance);

        // getting transactions from provided api
        const { transactions }: { transactions: TransactionData[] } =
          await accessAPIData('/transactions', apiKey);

        // filtering invalid transactions, processed ones and ones peformed after the to date
        const filteredTransactions = transactions.filter(
          (transaction) =>
            !isNaN(Number(transaction.amount)) &&
            new Date(transaction.date).toString() !== 'Invalid Date' &&
            new Date(transaction.date) > endDate &&
            transaction.status === 'PROCESSED'
        );

        // sorting transactions by date
        filteredTransactions.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );

        const balancesArray: BalanceData[] = [];

        // getting starting balance from the given date range
        const startDayBalance = getDayBalance(
          currentBalance,
          filteredTransactions,
          startDate
        );

        const balanceDay = new Date(startDayBalance.date);
        let dailyBalance = startDayBalance;

        // calculates the daily balance and adds to response array
        while (balanceDay > endDate) {
          dailyBalance = getDayBalance(
            dailyBalance,
            filteredTransactions,
            new Date(balanceDay)
          );

          balancesArray.push({
            date: `${String(balanceDay.getUTCDate()).padStart(2, '0')}/${String(
              balanceDay.getUTCMonth() + 1
            ).padStart(2, '0')}/${balanceDay.getFullYear()}`,
            amount: dailyBalance.amount,
            currency: dailyBalance.currency,
          });

          balanceDay.setDate(balanceDay.getDate() - 1);
        }

        // sorts in ascending date order in case this option is selected
        if (sort === 'asc')
          balancesArray.sort(
            (a, b) =>
              Number(a.date.split('/').reverse().join('')) -
              Number(b.date.split('/').reverse().join(''))
          );

        console.log(
          'Transactions used to calculate the balances:',
          filteredTransactions
        );

        return res.status(200).json(balancesArray);
      } else {
        return res.status(401).json({
          errorCode: 'UNAUTHORIZED',
          description: 'Missing API key.',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        errorCode: 'INTERNAL_SERVER_ERROR',
        description: 'Something went wrong. Please check the server logs.',
      });
    }
  }
);

export default app;
