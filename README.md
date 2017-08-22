# Votechain

Blockchain-based E2E voting method as API. Allows anyone to create transparent and safe elections that allow for easy vote recounting. Users are able to review votes on the browser and as a JSON file. This project is being developed as part of the Google Summer of Code 2017:
https://summerofcode.withgoogle.com/projects/#6255170307489792

## Motivation

Being able to recount votes is a huge step towards transparent elections. The vast majority of election methods around the globe (including manual and electronic ones) do not allow citizens to easily recount the votes in order to check for accuracy, or even if they do it is hard to do so. A Blockchain-based voting method allows all those interested to keep a log of the votes that were cast, as well as only allowing votes that are considered valid to be inserted into the election. Also, it reduces the effects of coercion, as it allows voteres to cast multiple votes, counting only the last one as valid. 
I wrote a short paper on this alongside Alexandre Gomes (@alegomes), which can be found here:
https://dl.acm.org/citation.cfm?id=3085263&CFID=948178741&CFTOKEN=68141706

## Code Style
The project is slowly moving towards the AirBnB Javascript coding style (https://github.com/airbnb/javascript) though a huge part of is still not following the recomendations. If you've got some time to spare, PRs are welcome :) 

## Demo
[1 min Youtube video](https://youtu.be/lfjZtcb2u40 "Votechain Demo")

## Getting Started

clone this repo
```
git clone https://github.com/teogenesmoura/votechain.git
``` 
Install dependencies
``` 
npm install 
``` 
Change the MongoDB connection URL to your URL

run :)
``` 
sudo nodemon server.js
```

## SSL Configuration
Votechain should run in a local network over encrypted connection using
the SSL protocol. In order to setup your certificate files, follow
these steps:

In your terminal, type the following line to generate an RSA key:
```
openssl genrsa 1024 > file.pem
```

then, execute this command:
```
openssl req -new -key file.pem -out csr.pem
```
and finally:
```
openssl x509 -req -days 365 -in csr.pem -signkey file.pem -out file.crt
```
Votechain will then be able to load your certificate files and you'll be able to access the app by going to https://localhost:443
credit goes to @Wilson on this Stack Overflow thread:
https://stackoverflow.com/questions/31156884/how-to-use-https-on-node-js-using-express-socket-io/31165649

## Tech Stack
Node JS/Express JS
ES6 
Socket.io
JQuery
Bootstrap

## Contributing

There are multiple possible contributions and I'll update this section as soon as I have a solid list. For now, there is a lot of code cleaning that needs to take place, as well as conforming the codebase to the AirBnB style as well as 
increasing test coverage and change remaining ES5 to ES6.

## Status of the Project 

Ever since the project began, I made several decisions that I hadn't predicted. In the beginning, I started out basing my project on another project called Naivechain (https://github.com/lhartikk/naivechain), which is a short 200 line Blockchain implementation in Javascript. That decision brought good and bad consequences. Because of it, I wasn't too scared of implementing a blockchain for voting with Javascript, and as the code for that project is super well-written, which I believe reflected on my own project. The downside, however, is that it uses sort of a centralized approach (there is a reason why it is called Naivechain), in which all communications go through a central node in order to be distributed to other nodes. That approach can also be seen in this project, and while it isn't necessarily a bad thing most people familiar with cryptocurrencies will soon notice the lack of proof-of-work or proof-of-stake algorithms, which may cause some raised eyebrows. Despite being somehow centralized, the way I decided to implement makes it easier for full decentralization: The central node mostly resembles a torrent file in the bit torrent protocol, as it contains references to other nodes interested in that file. Similarly, the central node on Votechain merely keeps a list of connected sockets and organizes communications, but never interferes with the voting procedure itself. Of course, it represents a rather latent vulnerability, since anyone that takes control of the central node may interfere with the whole election. What happened here is that I focused much more on the Blockchain-implementation part of the project (instead of using a readily available network such as Bitcoin, Ethereum and the such) instead of the voting part itself. The reason I did that is that I believe cryptocurrencies introduce a lot of overhead for non-financial related tasks: other projects related to voting on Bitcoin need to use a very limited text field to persist votes, which doesn't seem to me as an optimal solution. That limitation notwithstanding, one has also to worry about paying for each vote to be cast on an AltCoin network. Considering that Bitcoin has seen a tremendous increase in value over the last few months (and years), a country-wide election could impose a huge cost to interested companies, governments and so on. For those reasons and some others I won't get into in this text, I decided to implement my own Blockchain, which is a decision that, again, brings good and bad consequences. I had a lot of fun (and also some headaches) developing a protocol for client's communications over sockets that work as I had envisioned it: It allows anyone, anywhere, to create a distributed election and have people (and machines) to cast votes on it anonymously (unless you choose to share your identity with someone) and as soon as that election is over, recounting votes is a simple matter of inspecting a JSON file. That, in itself, represents a major advance over current electronic voting methods: recounting votes is still one of the major issues of elections around the globe, and we can't have a truly transparent election if votes can't be recounted by independent 3rd parties. Bad consequences, however, is that the voting interface (although I think it looks OK) could use some more work, as well as the Election creation/Voter Registration API. It lacks user authentication (which is a matter I've debated myself with for months now: should we create the PirateBay of distributed elections or a private platform?) and will be simplified in the future (I plan on having 100% Promises-based I/O on mongoose and get rid of the Async library). I believe the bad consequences, however, only require some more work to get corrected, while the good ones could potentially guarantee stronger democratic societies for many people out there. From a software engineering standpoint, I believe that I made a lot of advances to the project (well, I created it from scratch, so there's that) and to my own knowledge. Javascript seems now to me as a somehow bittersweet beauty: It is just like a little kitten who will joyfully play with its owner until he/she does something wrong and takes a bite in response. I tried to use design patterns and test-driven development as much as I could, but I do have to admit that several parts of the code still need to be refactored in order to meet best practices. All in all, it was a memorable summer and very fun to work on my GSoC project. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


