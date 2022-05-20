'use strict'
const bcrypt = require('bcrypt');

// Private Section

let RegisteredUsers = []

// Public Section 

module.exports = {
    getRegisteredUsers: function() {
        return RegisteredUsers 
    },
    addUser: function(user) {
    //Insert user into the Registered User List
    RegisteredUsers.push(user)
    },
    clearRegisteredUsersList: function() {
    RegisteredUsers = []
    },
    // Validate If the Password is Valid.
    isValidPassword: function (password_, email, username) {
     const passwordValidLength = 7
     return (!email.toUpperCase().includes(password_.toUpperCase()) && username.toUpperCase() !== password_.toUpperCase() && password_.length >= passwordValidLength)
    },
    isUniqueEmail: function(email) {
        for (let i = 0; i !== RegisteredUsers.length; i++) {
            if (RegisteredUsers[i].email === email) { return false }
          }
          return true
    },
    isUniqueUserName: function(username) {
        for (let i = 0; i !== RegisteredUsers.length; i++) {
            if (RegisteredUsers[i].username === username) { return false }
          }
          return true
    },
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
    isValidEmail: function(email) {
     const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     return regexp.test(String((email.toLowerCase())))
    },
    createUser: function (userdetails) {

        const User = {
            username: userdetails.username,
            email: userdetails.email,
            password: userdetails.password
        }
        return User
    }
    
}

