# Invoice Generator

This app will let you generate the invoice for you business, this is customizable and this will help you to track your invoices.


## Developer Setup

First, install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, create a `.env` file in the root directory of the project and add the following environment variables:

```env
NEXT_PUBLIC_APP_NAME=
DUMMY_PASSWORD=

MONGO_URI=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
