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

npm install 
``` 
Change the MongoDB connection URL to your URL

run :)
``` 
sudo nodemon server.js
```

## Tech Stack
Node JS/Express JS
ES6 
Socket.io
JQuery
Bootstrap

## Contributing

There are multiple possible contributions and I'll update this section as soon as I have a solid list. For now, there is a lot of code cleaning that needs to take place, as well as conforming the codebase to the AirBnB style as well as 
increasing test coverage and change remaining ES5 to ES6.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
