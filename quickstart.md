## Quickstart for development & deployment

## 0. Dependencies

- Install Node (v8+) **[here](https://nodejs.org/en/)**

## 1. Clone & setup local dependencies

```sh
git clone https://github.com/valgaze/gpt3-chat
cd gpt3-chat
npm run 1st_time
```

## 2. Swap in your API key

Swap in your API key in **[settings/key.json](settings/key.json)**

```
{
  "key": "XXXXXXXXXXXXXXXXXX"
}
```

## 3. Boot

From the directory into which you cloned this repo, run the following to boot servers w/ live reload on code changes

```sh
npm start
```

You should be able to see your chat interface w/ live reload on http://localhost:8080

## 4. Go nuts

- Use settings menu in bottom right to switch or modify personas

- Create a new persona in **[personas.js](src/personas.js)**

- Here's some **[useful learning resources & tips](./docs/resources.md)**
