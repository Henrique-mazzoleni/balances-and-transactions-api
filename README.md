# Balance and Transactions API

## Intro

Banxware is a fintech company that specializes in lending to small and 
medium-sized businesses (SMEs) in Germany and abroad. One of the key components 
of our lending process is underwriting, which is the process of assessing the 
creditworthiness of a borrower. 

We use a variety of sources of information to conduct underwriting, including 
credit bureau reports, platform data, revenue information, legal documents, and 
bank account transactions. Our goal is to gather as much information as 
possible about a borrower's financial history and current financial situation 
to make an informed lending decision. 

One of the key metrics we use when evaluating bank account transactions is 
overdrafts. An overdraft occurs when a merchant withdraws more money from their 
bank account than they have available. This can happen for a variety of 
reasons, such as an unexpected expense or a bounced check. 

Banks do not typically provide overdraft information by default. However, they 
do provide other information that can be used to calculate overdrafts, such as 
the daily balance of the account and the date and amount of each transaction. 

We are interested in working with you to develop a method for calculating 
overdrafts from bank account transactions. We believe that this information 
would be valuable in our underwriting process and would help us to make more 
informed lending decisions. 

You will have 7 days to complete the assessment after the email has been sent. 
If you have any questions about it, don't hesitate to send us an email. 

## API

From the two provided endpoints, `GET /balances` and `GET /transactions`, the 
data was extracted and processed in the new `GET /historical-balances`. The 
new endpoint uses authentication based on an API Key. A valid API Key should be 
sent using an HTTP header called `x-api-key`.

### `GET /historical-balances` 

This Endpoint will give a list of all the daily balances between 2 desired dates.
The endpoint has 3 required query paramaters:

##### `from` from date

Strating date of the to be displayed balances. It must be in `DD-MM-YYYY` format.

##### `to` to date

End date of the to be displayed balances. It must also be in `DD-MM-YYYY` format.
The end date must be at a later time than the from date. If the from and end date 
are the same only one balance will be displayed.

##### `sort` sorting order

Sorting order of the balances based on the dates. For this paramater there are two 
accepted values. `asc` for ascending values and `desc` for descending values. All 
other values will result in a `400` status response.

### Example of a Valid input

`GET /historical-balances?from=25-06-2022&to=27-06-2022&sort=desc`. 

This should give the balances on the given days in the following format:

```json
[
  {
    "date": "27/06/2022",
    "amount": 10287,
    "currency": "EUR"
  },
  {
    "date": "26/06/2022",
    "amount": 10026,
    "currency": "EUR"
  },
  {
    "date": "25/06/2022",
    "amount": 11630,
    "currency": "EUR"
  }
]
```

Bear in mind that all amounts are in cents, so `1 Euro` is represented as `100`.

## How to use and test this endpoint

### Building the project

```sh
npm install

npm run build

node build/src/server.js

🚀 Server started on port 3333!
📚 API docs are available on: http://localhost:3333/api-docs
```

You can now test the `/historical-balances` endpoint on `localhost:3333`

Once the server is running you can also access the Documentation through the 
`/api-docs` endpoint.


### Running the tests

The test suite uses the `API_URL` and `API_KEY` provided in the `.env` file with 
this repository. If necessary they may need to be added manualy to the environment 
variables.

Once the variables are set you can run the tests with:

```sh
npm test
```

- This application was developed and validated using [node LTS (v18.17.1)](https://nodejs.org/en/download).
