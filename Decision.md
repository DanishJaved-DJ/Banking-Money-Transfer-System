# Design Decisions

## 1. Database: PostgreSQL

We are using **PostgreSQL** as the database for the Banking Money Transfer System.

### Why PostgreSQL?

- PostgreSQL provides strong **ACID transaction support**, which is important for money transfers.
- Transfers require multiple database operations to succeed or fail together.
- PostgreSQL supports **row-level locking** using `SELECT ... FOR UPDATE`, which helps prevent race conditions when multiple transfers happen concurrently.
- PostgreSQL provides strong data integrity using **foreign keys, unique constraints, and CHECK constraints**.
- PostgreSQL's `NUMERIC(19,2)` type is suitable for storing monetary values without floating-point precision issues.

The database is hosted using **Supabase PostgreSQL**.

---

## 2. User and Account Design

For the current assignment, the **User entity is out of scope**.

The system currently works directly with the `Account` entity because authentication and user management are not part of the required functionality.

### Current Design

```text
Account
├── id
├── account_number
├── holder_name
├── balance
├── created_at
└── updated_at
```

We intentionally do **not** create a separate `users` table at this stage.

### Future Design

The system can easily be extended to support a separate `User` entity.

A possible future relationship would be:

```text
User
  │
  │ 1
  │
  │
  │ N
Account
```

This would allow a single user to own multiple bank accounts.

For example:

```text
User
 ├── Account 101
 ├── Account 102
 └── Account 103
```

In that design, the `accounts` table would contain a `user_id` foreign key:

```text
users
-----
id
name
email
...

accounts
--------
id
user_id      → users.id
account_number
balance
...
```

This separation keeps **user identity** and **bank account information** as different responsibilities.

Since user authentication, authorization, and user management are outside the assignment scope, implementing this relationship now would add unnecessary complexity.

---

## 3. ORM: Not Using an ORM

We are intentionally **not using an ORM** such as Prisma, Sequelize, or TypeORM.

The application uses PostgreSQL through the Node.js `pg` library and executes **parameterized SQL queries**.

### Why Raw SQL?

The main reason is that this project contains important database operations where understanding the actual SQL behavior is valuable.

For example, a money transfer requires:

```text
BEGIN
   ↓
Lock sender and receiver accounts
   ↓
Check sender balance
   ↓
Debit sender
   ↓
Credit receiver
   ↓
Create transaction record
   ↓
COMMIT
```

We need explicit control over:

- Database transactions
- `COMMIT` and `ROLLBACK`
- Row-level locking using `FOR UPDATE`
- Query ordering to reduce deadlock risk
- Constraints and indexes
- Exact SQL executed against PostgreSQL

Using raw SQL keeps these database operations explicit and easier to reason about for this assignment.

### Parameterized Queries

Although we are not using an ORM, we still use parameterized queries to avoid SQL injection.

Example:

```js
const query = `
    SELECT *
    FROM accounts
    WHERE id = $1;
`;

const result = await pool.query(query, [accountId]);
```

We do **not** construct SQL by directly concatenating user input.

---

## Summary

| Decision | Choice | Reason |
|---|---|---|
| Database | PostgreSQL | ACID transactions, locking, constraints, reliable monetary operations |
| Hosting | Supabase PostgreSQL | Managed PostgreSQL database |
| User entity | Not implemented for now | Authentication/user management is out of scope |
| Future User model | One User → Many Accounts | Allows a user to own multiple bank accounts |
| ORM | Not used | Explicit control over SQL and transaction/locking behavior |
| Database driver | Node.js `pg` | Direct PostgreSQL access with parameterized queries |

These decisions keep the current implementation simple and focused on the assignment requirements while leaving a clear path for future expansion.
