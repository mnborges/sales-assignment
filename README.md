# SALES ASSIGNMENT

This is my resolution for the challenge proposed by @williamneves [here](https://github.com/williamneves/sales-assignment).

## Set up environment variables

Copy the [`.env.local.example`] file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then set variables following the description under [auth](auth/) (Firebase configuration) and [studio](studio/) (Sanity configuration).

## Start up the Studio

Use the following command in the terminal to start up the studio:

```bash
npm run studio:dev
```

After compilation the studio should be up and running on http://localhost:3333!
