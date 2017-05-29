# Family Wallboard

## Setup

_Note this project is not meant for anything other than local network distribution as it uses API tokens directly, which can be viewed/stolen by the client._

**It is not secure to deploy this app to remote servers out of your control.**

- Add `.env.local` file with your personal Dropbox and DarkSky API tokens
- Customize sub-component properties in the `App` component
- `> yarn build`
- Transfer the `build` directory to some place for hosting on your local box
- `> yarn start` to test locally if you wish to hack around first
