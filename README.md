# StudAid Authentication Microservice
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

### Before starting - dev stage
```bash
npm run build
npm run start:dev
```

### Before starting - dev stage
```bash
npm run start:dev
```

## Routes
  - Auth
    - [X] Confirm Account
    - [X] Login User
    - [X] Logout User
    - [X] Refresh Token
    - [X] Forgot Password
    - [X] Reset Password
  - User
    - [X] Register New User
    - [X] Get Current User
    - [X] Change Password
    - [X] Update User
  - Platform
    - [X] Google
    - [X] Facebook


## Project Structure
| Name                        | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| **config/**                 | Project's Configuration                                 |
| **config/jwt/**             | JWT private, public keys from OpenSSL                   |
| **src/**                    | Source files                                            |
| **src/@types/**             | Custom Type Roots                                       |
| **src/config/**             | Application configuration                               |
| **src/core/**               | Reusable library source code like env configuration     |
| **src/db/**                 | DB connect and migration                                |
| **src/helpers/**            | Helper Funtions like dates, token extractions           |
| **src/middleware/**         | Middlewares like error handler, authentication          |
| **src/modules/**            | Source Modules like user, auth                          |
| **src/providers/**          | Third party services such as mailer, google             |
| **src/utils/**              | Frequently used services such as logger, responses      |


