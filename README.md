## Features

- 🟦 Typescript
- 🔥 Slash commands (autocomplete and buttons)
- ✉️ Message commands
- 🕛 Cooldowns
- 💪 Event & Command handlers
- 🍃 MongoDB Support
- 🪵 Logger with pino
- ⌨️ Dev and prod environtment

## Setup

### 1. Environment Variables

> put the environment variables inside working directory and name the file to .env or development.env

```env
TOKEN=(Discord bot token)
CLIENT_ID=(Discord client id)
PREFIX_COMMAND=$ # default prefix is $
MONGO_URI=(Mongo DB url) # default mongodb://mongo:stalker-bot
MONGO_DATABASE_NAME=(Mongo Database name) # default mongo:27017
BOT_DATABASE=(DB name in Mongo DB) # default stalker
USER_ID=(Your user id) # to create owner DM for changing logger level
```

### 2. Installation other modules

```
npm install
```

### 3. Build

```
npm run build
```

### 4. Run

```
// for production
npm run start:production

// for development
npm run start:dev

// or
// will use nodemon, compile and build if any file change
npm run dev
```

### Info

- To be able change logger level, send DM to bot with [PREFIX]logger trace | info | debug
  ex => ($logger trace)

### Acknowledgement

- This repo is forked from [Discord.js v14 Bot Template](https://github.com/MericcaN41/discordjs-v14-template-ts)
- I added more features from the original repo

### Contributing

- PR is welcome
- Please follow the code writting style

To see more examples and connect to lavalink please kindly check [Stalker Bot](https://github.com/khouwdevin/stalker-discord)
