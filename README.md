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
new endpoint uses authentication based on an API Key. 
Both endpoints use authentication based on an API Key. Therefore, we are also 
providing you with an API Key that should be sent using an HTTP header called 
`x-api-key`. The API Key value is 
`b4a4552e-1eac-44ac-8fcc-91acca085b98-f94b74ce-aa17-48f5-83e2-8b8c30509c18`.

### `GET /balances` 

This will give you a response in the following shape:  

```json
{ 
	"amount": 10000, 
	"currency": "EUR", 
	"date": "2022-06-30T23:59:59.577Z" 
}
```

### `GET /transactions`

This is going to return an array of transactions such as: 

```json
{ 
	"transactions": [ 
		{ 
			"amount": -765, 
			"currency": "EUR", 
			"date": "2022-02-07T09:57:27.235Z", 
			"status": "BOOKED" 
		}, 
		{ 
			"amount": -911, 
			"currency": "EUR", 
			"date": "2022-01-03T22:00:09.002Z", 
			"status": "PROCESSED" 
		}, 
        ...
	] 
} 
```

Bear in mind that all amounts are in cents, so `1 Euro` is represented as `100`.

## Mandatory requirements: 

- You should provide a REST endpoint where we can fetch the balances for a 
specific date, such as: 
`GET /historical-balances?from=03-01-2022&to=03-04-2022&sort=desc`. 

This should give the balance on this day in the following format:

```json
[ 
    { 
        "date": "04/01/2022", 
        "amount": 9109, 
        "currency": "EUR" 
    }, 
    { 
        "date": "03/01/2022", 
        "amount": 9109, 
        "currency": "EUR" 
    }
] 
```

- Your solution must include proper error handling and input validaton to
ensure data integrity.

- Implement logging for key events and errors.

- Unit tests are mandatory - manual test is nice but unit tests automate the 
process and allow us to make changes more confidently, 
we won't accept solutions without unit tests. 

- The code must be available on a public repository on your personal [GitHub](https://github.com) account.
    - Note: the original project already includes a `.git` folder where the remote is currently targetting
    to `Bitbucket`. In order to be able to `push` your changes to your `Github` account, you need to
    update the git remote to your Github account instead. If you don't have much familiarity with 
    [git](https://git-scm.com/), read [this thread](https://stackoverflow.com/questions/2432764/how-do-i-change-the-uri-url-for-a-remote-git-repository),
    the process of changing remote URLs is well explained there.

- Add a README to your project so we can run it ourselves and test it. 

- Add documentation for the new endpoint, the project already includes a 
[Swagger](https://swagger.io/specification/) file documenting the current state 
of the API.

## Optional requirements 

- Add a linter to the project, e.g. [ESLint](https://eslint.org/).

- Add integration tests.

## How to start developing using this boilerplate project?

### Build the project

```sh
npm run build
```

### Running the server 

```sh
# After cloning the repository, install the dependencies
npm install

# Start the server
npm start


> balances-and-transactions-api@1.0.0 start
> tsx src/server.ts --watch

🚀 Server started on port 3333!

# If you see the message above, everything worked!
# The `start` command has hot-reload on, i.e., anytime you modify a file
# the server restarts. Bear it in mind if your solution keeps state in memory.
```

### Running the tests

```sh
npm test
```

## Notes 

- This repository is a boilerplate using Typescript, the main programming 
language at Banxware, but feel free to use whatever works for you best.

- We've added an extra endpoint where you can visualize the API Documentation.
In order to do this: 
    - start the app: `npm start`
    - open the following link: [http://localhost:3333/api-docs](http://localhost:3333/api-docs)

- This application was developed and validated using [node LTS (v18.17.1)](https://nodejs.org/en/download).
