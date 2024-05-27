# cmc-proxy
A Nodejs **"dumb"** Proxy for interact with CoinMarketCap's new APIs.

## Motivation
Starting with the last version of CoinMarketCap (CMC) APIs released early 2019, it is no longer possible call the CMC's API directly from a client.

Choices are:
- integrating the API in your backend
- create a proxy if you are using a JAM stack app or similar

I dive more into this in my article "[Why I've built a Coinmarketcap proxy](https://medium.com/p/e06c898b5765)", feel free to comment and please point out errors if you find any. I'm a bit rusty :)

## Tech used
<b>Built with</b>
- [NodeJS](https://nodejs.org)
- [Express](https://expressjs.com)
- [Axios](https://github.com/axios/axios)

## Features
It's basically just a **dumb** proxy in the meaning that he has no business logic.

When he'll receive a request, he simply forward the request to CMC's API and send back you the response being it a successful request or not.

The response behavior will be the same as if you were questioning CMC's API directly, no data manipulation is done on the proxy.

That's why I've been calling it **"dumb"**.

## Local Installation and develompent execution
To install it locally, clone the repository, cd in cmc-proxy and type in your terminal
```
npm install
```

You also need to replace the **.env.sample** file with **.env** file and replace the content with your CMC's API.

To start the development server, type in your terminal
```
npm run dev
```

If you need to run the script in production, type in your terminal
```
npm run start
```

## Deploy on Zeit
If you are familiar with [Zeit](zeit.co), you have already noticed the ***.nowignore*** file.
It's basically the ***.gitignore*** used by Zeit's serverless platform.

On my [article](https://medium.com/p/e06c898b5765) you can find more details about it.

For a quick deploy on Zeit, you must add your CMC's API key as a secret
```
now secrets add cmc_api_key "YOUR_CMC_API_KEY_GOES_HERE_ALICE"
```
and then to deploy it type in your terminal
```
now
```
the console output will provide you the url of the proxy. You can change it directly from Zeit's dashboard.

## Can I deploy it on another platform?
Sure. 

You can deploy it on Lambda, on Azure Functions, on Heroku or on your favourite service as long as it can run NodeJS.

In this case, instead of setting the **now secret**, you have to replace the **.env.sample** file with **.env** file and replace the content with your CMC's API.

## Contribute
If you have feedbacks or ideas on how to improve it, let me know with an issue or submit directly a PR. 

It's kinda a simple project, I don't think many contributions will be needed but it would be nice to extend the deploy examples for other services (Lamba, Azure Functions,...)

## Credits
This project has been created because one night my JAM stack application that used to fetch information from CMC's API started firing errors. 

Once understood the reason (Client side call blocked by default using CORS) I've made this dumb proxy to solve the issue.

## License
MIT © [theBliz](https://imbrescia.it)