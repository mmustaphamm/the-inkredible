# Getting The App Started

### 1. Clone the repository

### 2. Install dependencies

```bash
npm install
```

### 3. Update the .env file

See the `.env.example` file for more information

### 4. SetUp DataBase

- Setup local MySQL DB
- Get Needed Credentials
- Add them to the env file

### 5. Create DB tables

```bash
npx sequelize-cli db:migrate
```

### 6. Fill DB tables

Two users will be created.

- The first `user1@example.com`. Account balance `#200000`.
- The second `user2@example.com`. Account balance `#200000`.
- Same password for both: `Asdf@1234`.
- Query `api/v1/auth/user-accounts` to get account number(s) for test.

```bash
npx sequelize-cli db:seed:all
```

### 5&6

- Migrate and Seed

```bash
npm run db:ms
```

### 7. Run the development server:

```bash
npm run dev
```

## Documentation

### Swagger

The API documentation in Swagger.

You can access the Swagger documentation running locally by visiting <a href="http://localhost:8000/api/v1/docs" >http://localhost:8000/api/v1/docs</a>.
