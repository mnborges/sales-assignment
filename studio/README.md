# Sanity Configuration

Adapted from [Sanity Example](https://github.com/vercel/next.js/tree/canary/examples/cms-sanity)

## Connect to a Sanity project

Run the following command:

```bash
(cd studio && npx @sanity/cli init)
```

The CLI will update [`sanity.json`] with the project ID and dataset name.

## Set up environment variables

Set these variables in `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` should be the `projectId` value from [`sanity.json`].
- `NEXT_PUBLIC_SANITY_DATASET` should be the `dataset` value from [`sanity.json`].
- `NEXT_PUBLIC_SANITY_TOKEN` create an API token with `read+write` permissions:
  - Run this to open your project settings or go to https://manage.sanity.io/ and open your project:
    ```bash
    (cd studio && npx @sanity/cli manage)
    ```
  - Go to **API** and the **Tokens** section at the bottom, launch its **Add API token** button.
  - Name it `NEXT_PUBLIC_SANITY_TOKEN`, set **Permissions** to `Editor`.
  - Hit **Save** and you can copy/paste the token.

## Configure CORS for localhost

Needed for live previewing unpublished/draft content.

```bash
npm --prefix studio run cors:add -- http://localhost:3000 --credentials
```
