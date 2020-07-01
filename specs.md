# Property Management Backedn Api

create a backend for professionals connection system. the front end will be made using REACT js. All the below functionality needs to be fully implemented in this project. Backemd and front end will be done concurrently

### PROJECT SETUP

- [x] config foler and connection to database
- [] project structure => models, routes, controllers, middleware,utils
- []

### Users & Authentication BACKEND

- []Authentication will be done using JWT/cookies
  - []JWT and cookie should expire in 30 days
- []User registration
  - []Once registered, a token will be sent along with a cookie (token = xxx)
  - []Passwords must be hashed
  - []confirmPasswords must be hashed
  - []users can login with email and password
  - []Plain text password will compare with stored hashed password
  - []Once logged in, a token will be sent along with a cookie (token = xxx)
- []users logout
  - []Cookie will be sent to set token = none
- []Get user
  - []Route to get the currently logged in users (via token)

* []Password reset (lost password)
  - []users can request to reset password
  - []A hashed token will be emailed to the users registered email address
  - []A put request can be made to the generated url to reset password
  - []The token will expire after 10 minutes

- []Update users info

  - []Authenticated user only
  - []Separate route to update password

- []user CRUD
  - []Admin or manager only
- []Users can only be made admin by updating the database field manually

### Users & Authentication FRONTEND

##### User Requirements

- name => String
- email => String
- number => String
- Role => String
- timestamps => Date

###### landlord

- calculateIncome => method
- blocks = [] Relationship

###### user

- calculateRent => method
- house => relationship
- started - Date
- left - Date
- Deposit - refunded || !

###### manager

- calculateIncome => method

### Apartmenrs

-[x] List all blocks in the database

- [x]Pagination
- [x]Select specific fields in result
- [x]Limit number of results
- [x]Filter by fields
- []Search blocks by radius from zipcode
  - []Use a geocoder to get exact location and coords from a single address field
- [x]Get single block
- [x]Create new block
  - [x]Authenticated users only
  - []Must have the role "manager" or "admin"
  - []Only one blocks per manager (admins can create more)
  - [x]Field validation via Mongoose
- []Upload a photo for block
  - []Owner only
  - []Photo will be uploaded to local filesystem
- [x]Update block
  - []Owner only
  - [x]Validation on update
- [x]Delete blocks
  - []Owner only
- []Calculate the average cost of all houses for an blocks
- []Calculate the average rating from the reviews for an blocks

### Blocks requirement

##### blocks

- name => String
- location => Geo
- hiuses => list => relationship
- manager => relationship
- users =>list => relationship
- totalRent => method
- timestamps => Date
- landlord => relationship
- averageReview => method

### houses

- []List all houses for an blocks
- [x]List all houses in general
  - [x]Pagination, filtering, etc
- [x]Get single house
- [x]Create new house
  - []Authenticated users only
  - []Must have the role "manager" or "admin"
  - []Only the manager or an admin can create a house for an blocks
  - []managers can create multiple houses
- [x]Update house
  - []manager only
- [x]Delete house

  - []manager only

  ##### House Requirements

  - houseNumber => String
  - desc => String
  - user(s) => relationship
  - totalRent => method
  - timestamps => Date

### Reviews

- []List all reviews for an blocks
- []List all reviews in general
  - []Pagination, filtering, etc
- []Get a single review
- []Create a review
  - []Authenticated users only
  - []Must have the role "user" or "admin" (no publishers)
- []Update review
  - []Owner only
- []Delete review

  - []Owner only

  ##### Review Requirements

  - desc => String
  - rating => Number
  - houseNumber => String
  - owner => relationship
  - timestamps => Date

## Security

- [x]Encrypt passwords and reset tokens => bcrypt
- []Prevent cross site scripting - XSS
- []Prevent NoSQL injections
- []Add a rate limit for requests of 100 requests per 10 minutes => express-limit
- []Protect against http param polution
- []Add headers for security (helmet)
- []Use cors to make API public (for now)

### Pdf Generation => pdfkit

- invoice
- memo
- income
- user agreement

### sending Emails => nodemailer => sendgrid

- auth
- invoice
- notice
- announcements

## Relationships

- mongoose virtuals and populate
- landlord, block, house, user shares a user
- basically system is for manager therefore other entities are to be added by a seeder or manually
-

### Error Hnadling express

- error middleware
- async error handlers

## Documentation

- Use Postman to create documentation
- Use docgen to create HTML files from Postman
- Add html files as the / route for the api

## Deployment (Digital Ocean)

- Push to Github
- Create a droplet - https://m.do.co/c/5424d440c63a
- Clone repo on to server
- Use PM2 process manager
- Enable firewall (ufw) and open needed ports
- Create an NGINX reverse proxy for port 80
- Connect a domain name
- Install an SSL using Let's Encrypt

##

## Code Related Suggestions

- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data
