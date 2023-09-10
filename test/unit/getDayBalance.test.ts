import getDayBalance, { validDate } from '../../src/services/getDayBalance';
import { TransactionData } from '../../src/services/getDayBalance';

const currentBalance = {
  amount: 1000,
  currency: 'EUR',
  date: '2023-06-25T23:59:59.999Z',
};

const transactions = [
  {
    amount: -400,
    currency: 'EUR',
    date: '2023-06-24T12:43:12.159Z',
    status: 'PROCESSED',
  },
  {
    amount: -500,
    currency: 'EUR',
    date: '2023-06-24T15:46:38.654Z',
    status: 'PROCESSED',
  },
  {
    amount: -600,
    currency: 'EUR',
    date: '2023-06-24T08:21:54.687Z',
    status: 'PROCESSED',
  },
  {
    amount: 300,
    currency: 'EUR',
    date: '2023-06-23T18:12:35.987Z',
    status: 'PROCESSED',
  },
  {
    amount: 400,
    currency: 'EUR',
    date: '2023-06-23T05:53:07.056Z',
    status: 'PROCESSED',
  },
  {
    amount: 500,
    currency: 'EUR',
    date: '2023-06-23T23:57:24.426Z',
    status: 'PROCESSED',
  },
] as TransactionData[];

const goalDate = new Date('2023-06-23T23:59:59.999Z');

describe('getDailyBalance', () => {
  it('should return requested daily balance', () => {
    const calculatedBalance = getDayBalance(
      currentBalance,
      transactions,
      goalDate
    );
    expect(calculatedBalance).toEqual({
      amount: 2500,
      currency: 'EUR',
      date: '2023-06-23T23:59:59.999Z',
    });
  });

  it('should fail if balance date is not ISO formated', () => {
    const invalidDateBalance = {
      amount: 1000,
      currency: 'EUR',
      date: '25-6-2023',
    };
    const calculatedBalance = getDayBalance(
      invalidDateBalance,
      transactions,
      goalDate
    );
    expect(calculatedBalance).not.toEqual({
      amount: 2500,
      currency: 'EUR',
      date: '2023-06-23T23:59:59.999Z',
    });
  });
});

describe('testValidDate', () => {
  it('should return true for valid date', () => {
    const date = new Date('2023-08-13');
    expect(
      validDate(date.getFullYear(), date.getMonth(), date.getDate())
    ).toBeTruthy();
  });

  it('should return false for invalid month', () => {
    expect(validDate(2023, 13, 1)).toBeFalsy();
  });

  it('should return false for invalid day', () => {
    expect(validDate(2024, 11, 32)).toBeFalsy();
    expect(validDate(2023, 10, 31)).toBeFalsy();
    expect(validDate(2023, 1, 29)).toBeFalsy();
  });

  it('should detect leap years', () => {
    expect(validDate(2020, 1, 29)).toBeTruthy();
  });

  it('should invalidate future dates', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(
      validDate(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
    ).toBeFalsy();
  });
});
