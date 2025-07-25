# This project has 2 sides
- dashboard-frontend - built with React 19, TypeScript, and Vite
- dashboard-backend - powered by Express.js and connected to a MongoDB database using Mongoose

> **Note:** For both parts you will find a README.md inside each directory with steps on how to run them.
- <a href="https://github.com/nicolasflorth/dashboard-app/blob/main/dashboard-frontend/README.md" title="Frontend readme" target="_blank">Frontend readme</a>
- <a href="https://github.com/nicolasflorth/dashboard-app/blob/main/dashboard-backend/README.md" title="Backend readme" target="_blank">Backend readme</a>

> **Note:** Database is seeded with 10 transaction and one user on the first backend run

> **Important:** Login details of the created user: test@test.com / emilyspass

## The Frontend is using
- React 19
- TypeScript
- React router
- Redux toolkit
- React datetime
- Tanstack react query
- Zod
- MUI components
- Axios
- JWT
- Vitest (unit and integration tests)
- Translation with i18next and lazy loaded files
- Light/Dark theme
- notistack - a npm package to show notifications as on the Login page bellow

## The Backend is using
- bcrypt - to securely store passwords into the database
- cookie-parser - to set cookies
- cors
- dotenv - for environment variables to seek secret data secret
- express
- jsonwebtoken - for authentication and authorisation 
- mongoose - for the database
- nodemailer - to send emails for when a new created account needs email validation

# Recomended environment
- node v20.19.3 
- npm v10.8.2


# Preview
<table>
  <tr>
    <td>
      <a href="images/login-page-min.jpg" target="_blank">
        <img src="images/login-page-min.jpg" alt="Login page" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
      <a href="images/register-page.jpg" target="_blank">
        <img src="images/register-page.jpg" alt="Register page" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
      <a href="images/dashboard-page-min.jpg" target="_blank">
        <img src="images/dashboard-page-min.jpg" alt="Dashboard page" width="250" style="margin:10px;" />
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="images/transactions-listing-min.jpg" target="_blank">
        <img src="images/transactions-listing-min.jpg" alt="Transactions listing" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
      <a href="images/transactions-listing-light-theme-min.jpg" target="_blank">
        <img src="images/transactions-listing-light-theme-min.jpg" alt="Transactions listing light theme" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
      <a href="images/transactions-listing-add-transaction-min.jpg" target="_blank">
        <img src="images/transactions-listing-add-transaction-min.jpg" alt="Add transaction" width="250" style="margin:10px;" />
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="images/transactions-listing-edit-transaction-min.jpg" target="_blank">
        <img src="images/transactions-listing-edit-transaction-min.jpg" alt="Edit transaction" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
      <a href="images/transactions-listing-remove-transaction-min.jpg" target="_blank">
        <img src="images/transactions-listing-remove-transaction-min.jpg" alt="Remove transaction" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
      <a href="images/translation-min.jpg" target="_blank">
        <img src="images/translation-min.jpg" alt="Translation" width="250" style="margin:10px;" />
      </a>
    </td>
    <td>
    </td>
  </tr>
</table>
