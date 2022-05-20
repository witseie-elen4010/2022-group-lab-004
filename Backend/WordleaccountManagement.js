const database = require('./database_Connection')
const wordleAccountProcess = require('./Wordleaccountprocess')
const bcrypt = require('bcrypt');

// Create a query message to add user Account details to the Database
const sqlQuery = function (user) {
    // Hashing Password for security purposes. 
    const passwordHash = bcrypt.hashSync(user.password, 10);
    console.log(passwordHash)

    const User = {
      username: user.username,
      email: user.email,
      // Storing Hashed Password
      password: passwordHash
    }
    const command = 'INSERT INTO Users (username, email, password) '
    const formattedData = `VALUES ('${User.username}', '${User.email}', '${User.password}');`
    return command + formattedData
  }
  // Retrive user acccounts from the database and store them in a server
  async function retrieveRegisteredUsers () {
    try {
      const pool = await database.pools
      const users = await pool.request().query('SELECT * FROM Users')
      wordleAccountProcess.clearRegisteredUsersList()
      users.recordset.forEach(user => {
         wordleAccountProcess.StoreRegisteredUser(user)
         console.log(user)
      })
    } catch (err) {
      console.log(err)
    }
  }

// Send appropriate Error Messages to the Error Message page
module.exports.addUser = async function (userdetails, req, res) {
     const user = wordleAccountProcess.createUserObject(userdetails)
    try{   
          await retrieveRegisteredUsers()
          if(!wordleAccountProcess.isUniqueUserName(user.username)){
            const message = `Username '${user.username}' Already Registered.`
            res.render('Error.ejs',
              { error: 'Username Is Invalid', message: message, tips: [], buttonlink: '/signUp', button: 'Create Account' })
            return
          }
          if (!wordleAccountProcess.isValidUserName(user.username)) {
            const message = `Username '${user.username}' cannot be used. Here are tips for username:`
            const Usernametips = ['Must have atleast 5 alphanumeric characters', 'Must not be the same with password']
            res.render('Error.ejs',
        { error: 'Username Is Invalid', message: message, tips: Usernametips, buttonlink: '/signUp', button: 'Create Account' })
            console.log(message)
            return 
          }
          if(!wordleAccountProcess.isUniqueEmail(user.email)){
            const message = `Email '${user.email}' Already Registered.`
          res.render('Error.ejs',
        { error: 'Email Is Invalid', message: message, tips: [], buttonlink: '/signUp', button: 'Create Account' })
            return
         }
         if(!wordleAccountProcess.isValidPassword(user.password, user.email, user.username)){
        const message = 'The Password Entered Are Invalid. Here Are Password Requirements:'
        const passwordtips = ['Must Atleast Have 7 alphanumeric characters', 'Must not be the same with username', 'Must not be exact part of email']
      res.render('Error.ejs',
        { error: 'Password Is Invalid', message: message, tips: passwordtips, buttonlink: '/signUp', button: 'Create Account' })
            return
         }
         const pool = await database.pools
        // Sends a request to create User when details satisfies the requirements
         await pool.request().query(sqlQuery(user))
         res.redirect('/signUp')
    } catch(error){
        console.log(error)
    }
        
  }