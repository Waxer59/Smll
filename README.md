# Smll

<img src="./public/og.png" width="800px" />

## How to run the project?

1. Install all the dependencies with the command:

```bash
pnpm i
```

2. Rename the file `.template.env` to `.env` and fill the fields.

    - `APPWRITE_API_KEY` - api key of the appwrite project
    - `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - project id of the appwrite project
    - `NEXT_PUBLIC_APPWRITE_ENDPOINT` - endpoint of the appwrite project
    - `NEXT_PUBLIC_BASE_URL` - the base url of the project
    - `NODE_ENV` - development | production | test (default: development)
    - `JWT_SECRET` - random string

3. Run the project with the command:

```bash
pnpm dev
```

## Technologies used
* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Mantine](https://mantine.dev/)
* [react-qrcode-logo](https://github.com/gcoro/react-qrcode-logo)
* [Appwrite](https://appwrite.io/)
* [Lucide](https://lucide.dev/)
* [Sonner](https://github.com/emilkowalski/sonner)
* [Vitest](https://vitest.dev/)