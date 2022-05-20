'use strict'

const Wordleaccountprocess = require("../Backend/Wordleaccountprocess")

test('Empty Registered User lists is returned', () => {
    Wordleaccountprocess.clearRegisteredUsersList()
    expect(Wordleaccountprocess.getRegisteredUsers()).toEqual([])
  })

describe('Registered Users are Unique(unique username and email)', () => {
    test('Unregisterd Username is unique', () => {
      Wordleaccountprocess.clearRegisteredUsersList()
      expect(Wordleaccountprocess.isUniqueUserName('Tshililo')).toEqual(true)
    })
  
    test('Already Registered Username is not unique', () => {
    Wordleaccountprocess.getRegisteredUsers()
      const User = {
          username: 'Tshililo'
      }
      Wordleaccountprocess.StoreRegisteredUser(Wordleaccountprocess.createUserObject(User))
      expect(Wordleaccountprocess.isUniqueUserName('Tshililo')).not.toEqual(true)
    })
  
    test('UnRegistered email address is Unique', () => {
        Wordleaccountprocess.getRegisteredUsers()
      expect(Wordleaccountprocess.isUniqueEmail('ralukaket7@gmail.com')).toEqual(true)
    })
  
    test('Already Registered Email address is not Unique', () => {
      Wordleaccountprocess.getRegisteredUsers()
      const User = {
        email: 'ralukaket7@gmail.com'
      }
      Wordleaccountprocess.StoreRegisteredUser(Wordleaccountprocess.createUserObject(User))
      expect(Wordleaccountprocess.isUniqueEmail('ralukaket7@gmail.com')).not.toEqual(true)
    })
})

describe('Testing if User Regsitering Details(username, email and password) are valid', () => {
    test('Username shorter than 5 letters is invalid.', () => {
      Wordleaccountprocess.getRegisteredUsers()
      expect(Wordleaccountprocess.isValidUserName('Ron')).not.toEqual(true)
    })


    test('Username containing special character is invalid.', () => {
      Wordleaccountprocess.clearRegisteredUsersList()
      expect(Wordleaccountprocess.isValidUserName('Percy@')).not.toEqual(true)
    })
    test('Username containing a space is invalid.', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        expect(Wordleaccountprocess.isValidUserName('tshililo percy')).not.toEqual(true)
      })
    test('Username containing a space is invalid.', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        expect(Wordleaccountprocess.isValidUserName('tshililo percy')).not.toEqual(true)
      })
    test('Username with less than 5 letters is invalid', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        expect(Wordleaccountprocess.isValidUserName('Ralu')).not.toEqual(true)
      })
      test('Correctly Formatted Username is Valid', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        expect(Wordleaccountprocess.isValidUserName('tshililopercy7')).toEqual(true)
      })
//Ema
    test('Incorrectly Formatted email address is invalid', () => {
      const email = 'tshililogmail.com'
      expect(Wordleaccountprocess.isValidEmail(email)).not.toEqual(true)
    })
    test('Incorrectly Formatted email address is invalid', () => {
        const email = 'tshililogmail'
        expect(Wordleaccountprocess.isValidEmail(email)).not.toEqual(true)
      })
    test('google formatted email is Valid', () => {
        const email = 'ralukaket7@gmail.com'
        expect(Wordleaccountprocess.isValidEmail(email)).toEqual(true)
    })
    test('Password less than 9 letter is invalid', () => {
      Wordleaccountprocess.clearRegisteredUsersList()
      const User = {
          username: 'Tshililo',
          email: 'chililopercy7@gmail.com',
          password: 'raluk'
      }
      expect(Wordleaccountprocess.isValidPassword(User.password, User.email, User.username)).not.toEqual(true)
    })
  
    test('Password same as username is invalid', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        const User = {
            username: 'tshililopercy',
            email: 'chililopercy7@gmail.com',
            password: 'tshililopercy'
        }
        expect(Wordleaccountprocess.isValidPassword(User.password, User.email, User.username)).not.toEqual(true)
    })
    test('password which is part of the email is invalid', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        const User = {
            username: 'tshililopercy',
            email: 'chililopercy7@gmail.com',
            password: 'chililopercy7'
        }
        expect(Wordleaccountprocess.isValidPassword(User.password, User.email, User.username)).not.toEqual(true)
    })
    test('Password greater than 9 letters, not same as username and not part of email is Valid', () => {
        Wordleaccountprocess.clearRegisteredUsersList()
        const User = {
            username: 'tshililopercy',
            email: 'chililopercy7@gmail.com',
            password: 'Humbelani'
        }
        expect(Wordleaccountprocess.isValidPassword(User.password, User.email, User.username)).toEqual(true)
    })
  })