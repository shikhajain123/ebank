import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
    isError: false,
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })

    history.replace('/')
  }

  failure = errorMessage => {
    this.setState({isError: true, errorMessage})
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onBankLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {user_id: username, password}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.failure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMessage, isError} = this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="login-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>

          <form className="form-container" onSubmit={this.onBankLogin}>
            <h1 className="welcome-heading">Welcome Back!</h1>

            <label htmlFor="user" className="label">
              User ID
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter User ID"
              value={username}
              id="user"
              onChange={this.onChangeUserName}
            />

            <label htmlFor="password" className="label">
              Pin
            </label>
            <input
              type="password"
              className="input"
              placeholder="Enter PIN"
              value={password}
              id="password"
              onChange={this.onChangePassword}
            />

            <button type="submit" className="login-btn">
              Login
            </button>
            {isError === true && <p className="error"> {errorMessage} </p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
