# Nimbus

## Description

A robust financial application built with Next.js, Prisma ORM, MongoDB, and Bootstrap SCSS, designed to provide a secure and efficient platform for account creation, deposits, and withdrawals.

## Installation

1. **Prerequisites:**

   - Ensure you have Node.js and npm installed on your system. Refer to [Next.js Installation Guide](https://nextjs.org/docs/app/getting-started/installation) for detailed instructions:

2. **Clone or Download the Repository:**

   - Clone the repository using Git:

     ```bash
     git clone https://github.com/ppauliushchyk/nimbus.git
     ```

   - Download the repository as a ZIP file.

3. **Install Dependencies:**

   - Navigate to the project directory:

     ```bash
     cd nimbus
     ```

   - Install project dependencies:

     ```bash
     npm install --force
     ```

4. **Set Up Environment Variables:**

   - Locate the `.env.template` file within the project directory.
   - Copy the `.env.template` file and rename it to `.env`.
   - Open the `.env` file in a text editor and set the required environment variables.

5. **Seed the Database (Optional):**

   - This step is optional and depends on your project's requirements. If you need to populate your database with initial data, you can use the provided Prisma seed script:

     ```bash
     npx prisma db seed
     ```

> [!IMPORTANT]  
> If you see a peer dependencies warning, you need to use the --force or --legacy-peer-deps flag to ignore the warning. This won't be necessary once both Next.js 15 and React 19 are stable.

## Development

1. **Start Development Server:**

   - Run the following command to start the development server and access the application at `http://localhost:3000`:

     ```bash
     npm run dev
     ```

2. **Build for Production:**

   - Create an optimized production build for deployment using:

     ```bash
     npm run build
     ```

   - Start the production server by running:

     ```bash
     npm run start
     ```

## Testing

1. **End-to-End (E2E) Tests:**

   - Run E2E tests using Cypress with:

     ```bash
     npm run test:e2e
     ```

     ```bash
     npm run test:e2e:headless
     ```

2. **Component Tests:**

   - Run unit tests for individual components with:

     ```bash
     npm run test:component
     ```

     ```bash
     npm run test::headless
     ```

## Testing Realtime Balance Updates

**Running the Tests:**

1. **Seed the Database (Optional):**

   - This step is optional and depends on your project's requirements. If you need to populate your database with initial data, you can use the provided Prisma seed script:

     ```bash
     npx prisma db seed
     ```

2. **Start the Application:**

   - Open your terminal and navigate to the project directory.

   - Run the following command to start the application in development mode:

     ```bash
     npm run dev
     ```

   - This will start the application server on a specific port (http://localhost:3000).

3. **Run the Realtime Balance Update Tests:**

   - In a separate terminal window, navigate to the project directory.

   - Run the following command to execute the test script:

     ```bash
     npm run test:balance-updates
     ```

   - This command will typically:

     - Simulate a deposit transaction.
     - Wait for a second.
     - Verify that the balance is updated in the application every 10 seconds.
