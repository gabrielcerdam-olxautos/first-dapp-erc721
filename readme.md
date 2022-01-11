# Environment

```
> truffle version
Truffle v5.4.19 (core: 5.4.19)
Solidity - 0.8.10 (solc-js)
Node v14.17.6
Web3.js v1.5.
```

## npm packages

```
  "devDependencies": {
    "@openzeppelin/contracts": "^4.4.1"
  }
```

## Installation

```
> npm install
```

## Usage frontend

```javascript
> npm run dev
```

Go to [localhost](http://localhost:8080).

## Setup local blockchain

```truffle
>(truffle environment) compile
>(truffle environment) migrate --reset
```

```truffle
> truffle develop
```

or if you are using ganache

```truffle
> truffle console
```

## ERC-721

### ERC-721 Token Name

```
> let instance = await StarNotary.deployed();
> await instance.name // -> NFT

```

### ERC-721 Token Symbol

```
> let instance = await StarNotary.deployed();
> await instance.symbol // -> Non-Fungible-Token
```
