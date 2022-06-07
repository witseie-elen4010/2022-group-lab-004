## Security
## Context

Users will be required to sign up with their details.Therefore for security and privacy of user's details, it is important to hash passwords.
Cookies implemented should also follow basic security principles.

## Decision

The password created and inputted by the user will be posted to the server and hashed using a function from a bcrypt library on the backend.
Session cookies will be implemented and set to expire after an hour. Cookies will also use the default option "Http only" for security. These will 
only be used to store the usernames for identification and not for tracking purposes.

## Status: Accepted

## Consequences

Protecting passwords by hashing is good practice and will prevent potential risk to senitive information been exposed.