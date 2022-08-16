# Firebase Configuration

Adapted from [LogRocket blog](https://blog.logrocket.com/implementing-authentication-in-next-js-with-firebase/).

## Create an Firebase Account and App

A firebase account is needed to successfully configure firebase authentication with this project. Head [here](https://firebase.google.com/) and create one. Then, you will need to create an app to get API keys.

Now, click on the **settings icon** right beside Project Overview (in the top left part of your screen). In **Project Settings** and under **General**, you should see your app with its config.

Then you will need to enable the sign-in methods you want to use. To do so, click on **Authentication** and then **Sign in methods**. Each one has different configurations, but this project uses the traditional email/password method.

## Add local environments to Next.js

A Next.js project automatically ignores `.env.local` thanks to its `.gitignore` file, so you can copy/paste your keys and not worry that they will be committed to GitHub accidentally.

Set these variables in `.env.local`:

- `NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY` should be the `apiKey` from SDK setup and configuration.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` should be the `authDomain`.
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` should be the `projectId`.
