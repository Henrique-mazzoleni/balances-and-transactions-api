import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { getHistoricalBalance, accessAPIData } from './services/getAPIData';

import type { Request } from 'express';
import getDayBalance, {
  BalanceData,
  TransactionData,
} from './services/getDayBalance';

type QueryParams = {
  from: string;
  to: string;
  sort: 'asc' | 'desc';
};

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get(
  '/historical-balances',
  async (req: Request<unknown, unknown, unknown, QueryParams>, res) => {
    const apiKey = req.get('x-api-key');
    const { from, to, sort } = req.query;

    // validation for missing query parameters
    if (!from || !to || !sort) {
      return res.status(400).json({
        errorCode: 'BAD_REQUEST',
        description: 'Missing query paramaters.',
      });
    }

    const [fromDay, fromMonth, fromYear]: number[] = from
      .split('-')
      .map(Number);
    const [toDay, toMonth, toYear]: number[] = to.split('-').map(Number);

    const startDate = new Date(Date.UTC(fromYear, fromMonth - 1, fromDay));
    startDate.setDate(startDate.getDate() + 1);
    startDate.setTime(startDate.getTime() - 1);

    const endDate = new Date(Date.UTC(toYear, toMonth - 1, toDay));
    endDate.setDate(endDate.getDate() + 1);
    endDate.setTime(endDate.getTime() - 1);

    try {
      if (apiKey) {
        const currentBalance: BalanceData = await accessAPIData(
          '/balances',
          apiKey
        );

        const { transactions }: { transactions: TransactionData[] } =
          await accessAPIData('/transactions', apiKey);

        const filteredTransactions = transactions.filter(
          (transaction) => transaction.status === 'PROCESSED'
        );

        filteredTransactions.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );

        const balancesArray: BalanceData[] = [];

        const startDayBalance = getDayBalance(
          currentBalance,
          filteredTransactions,
          startDate
        );
        const balanceDate = new Date(startDayBalance.date);

        balancesArray.push({
          date: `${String(balanceDate.getUTCDate()).padStart(2, '0')}/${String(
            balanceDate.getUTCMonth() + 1
          ).padStart(2, '0')}/${balanceDate.getFullYear()}`,
          amount: startDayBalance.amount,
          currency: startDayBalance.currency,
        });

        const balanceDay = new Date(startDayBalance.date);
        let dailyBalance = startDayBalance;

        while (balanceDay > endDate) {
          balanceDay.setDate(balanceDay.getDate() - 1);
          dailyBalance = getDayBalance(
            dailyBalance,
            filteredTransactions,
            new Date(balanceDay)
          );
          const balanceDate = new Date(dailyBalance.date);
          balancesArray.push({
            date: `${String(balanceDate.getUTCDate()).padStart(
              2,
              '0'
            )}/${String(balanceDate.getUTCMonth() + 1).padStart(
              2,
              '0'
            )}/${balanceDate.getFullYear()}`,
            amount: dailyBalance.amount,
            currency: dailyBalance.currency,
          });
        }

        if (sort === 'asc')
          balancesArray.sort(
            (a, b) =>
              Number(a.date.split('/').reverse().join('')) -
              Number(b.date.split('/').reverse().join(''))
          );

        return res.status(200).json(balancesArray);
      } else {
        return res.status(401).json({
          errorCode: 'INVALID_API_KEY',
          description: 'Invalid API key provided.',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default app;
