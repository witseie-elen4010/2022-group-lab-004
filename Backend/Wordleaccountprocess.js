'use strict'
const bcrypt = require('bcrypt');

// Private Section

// Stores Registered Accounts For Validation
let RegisteredUsers = []

// Public Section 

module.exports = {
    getRegisteredUsers: function() {
        return RegisteredUsers 
    },
    StoreRegisteredUser: function(user) {
    //Insert user into the Registered User List
    RegisteredUsers.push(user)
    },
    // Clears the Registered Users List
    clearRegisteredUsersList: function() {
    RegisteredUsers = []
    },
    // Validate If the Password is Valid.
    isValidPassword: function (password_, email, username) {
     const passwordValidLength = 7
     return (!email.toUpperCase().includes(password_.toUpperCase()) && username.toUpperCase() !== password_.toUpperCase() && password_.length >= passwordValidLength)
    },
    // checks if the Email is not registered already
    isUniqueEmail: function(email) {
        for (let i = 0; i !== RegisteredUsers.length; i++) {
            if (RegisteredUsers[i].email === email) { return false }
          }
          return true
    },
    // checks if the Username is not already registered
    isUniqueUserName: function(username) {
        for (let i = 0; i !== RegisteredUsers.length; i++) {
            if (RegisteredUsers[i].username === username) { return false }
          }
          return true
    },
    // checks if the Username satisfies requirements
    isValidUserName: function(username) {
    const minimumLength = 5
    if (username.length < minimumLength) { return false }

    const alphabetLettersArray = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const validnumbersArray = '0123456789'.split('')

    for (let i = 0; i !== username.length; i++) {
      if ((alphabetLettersArray.indexOf(username[i].toLowerCase()) !== -1) || (validnumbersArray.indexOf(username[i]) !== -1)) { continue } else { return false }
    }
    return true
    
    },
    //Checks if Email entered is a valid email
    isValidEmail: function(email) {
     const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     return regexp.test(String((email.toLowerCase())))
    },
    // Create User Object 
    createUserObject: function (userdetails) {

        const User = {
            username: userdetails.username,
            email: userdetails.email,
            password: userdetails.password
        }
        return User
    }
    
}

