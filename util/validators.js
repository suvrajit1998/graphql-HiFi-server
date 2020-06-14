const validator = require('validator')

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmpassword
) => {
  const errors = {}

  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty'
  } else {
    if (!validator.isEmail(email)) {
      errors.email = 'Email must be a valid email address'
    }
  }

  if (password === '') {
    errors.password = 'Password must not be empty'
  } else if (password !== confirmpassword) {
    errors.confirmpassword = 'Password must match'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {}

  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }

  if (password === '') {
    errors.password = 'Password must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
