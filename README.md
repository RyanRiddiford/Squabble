# Squabble Web App

The Squabble Web App (Client) is the frontend user interface for the Squabble Chat Application.

## Useful links

| Description  | URL |
| ------------ | --- |
| Squabble-Client (this project)  | https://github.com/RMIT-COSC2650-SP3-2021-Team-3/Squabble-Client  |
| Squabble-Server                 | https://github.com/RMIT-COSC2650-SP3-2021-Team-3/Squabble-Server  |
| Azure Portal*                   | https://portal.azure.com |

\* Azure hosts the database, the production deployments and the file/blob storage.

## Development

### Requirements

- Node.js v14

### Running the code

1. Install dependencies with `npm install`
2. Start the development server with `npm run start`
3. Start `Squabble-Server` (the API that communicates with the database)*
4. The project is now accessible locally at `http://localhost:4200` or `http://127.0.0.1:4200`

\* See the `Squabble-Server` source code for specific instructions on how to run this.

### Coding conventions

TODO: Talk about source code structure etc. 

### Testing

Run the unit tests with `npm run test`.

## Deploying the code

The code can be deployed to any number of hosts, options are Netlify, AWS, DigitalOcean, Azure and
more!

We chose Azure Static Web App to deploy our code and the instructions to follow our setup can be 
found in the Azure documentation portal
[here](https://docs.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=angular).

Instructions on deploying the Squabble API and related applications, such as the database and
blob storage can be found in the `Squabble-Server` README.

## Demo users

| Username   | Password |
| ---------- | -------- |
| Dragonborn | abc123   |
| Hayzeus    | dial911  |

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

To generate the changelog run `git log --format='- %s (Commit: %h) [Author: %aN]' > CHANGELOG.md`.

## Known issues/bugs

- Bug #1 TBA
- Bug #2 TBA

## License

The source code is licensed under Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
International. 

This license allows reusers to copy and distribute the material in any medium or format in
unadapted form only, for noncommercial purposes only, and only so long as attribution is given to
the creator.

See [LICENSE.md](LICENSE.md) for the full text.
