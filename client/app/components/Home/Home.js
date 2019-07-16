import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../../utils/storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      SignInemail: "",
      SignInpassword: "",

      SignUpEmail: "",
      SignUpPassword: "",
      SignUpFN: "",
      SignUpLN: "",

      SignupError: "",
      SigninError: ""
    };
    this.onTextBoxChange = this.onTextBoxChange.bind(this);

    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("login_token");

    if (obj && obj.token) {
      console.log(obj);
      const { token } = obj;
      fetch("/api/account/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
              token: ""
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  signup() {
    this.setState({
      isLoading: true
    });
    //grabState
    const { SignUpEmail, SignUpPassword, SignUpFN, SignUpLN } = this.state;
    fetch("/api/account/signup", {
      method: "POST",
      body: JSON.stringify({
        email: SignUpEmail,
        password: SignUpPassword,
        firstname: SignUpFN,
        lastname: SignUpLN
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          SignupError: json.messege,
          isLoading: false
        });
      });
  }

  signin() {
    console.log("here");
    this.setState({
      isLoading: true
    });
    //grabState
    const { SignInemail, SignInpassword } = this.state;
    fetch("/api/account/signin", {
      method: "POST",
      body: JSON.stringify({
        email: SignInemail,
        password: SignInpassword
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log("here");
          setInStorage("login_token", { token: json.token });
          this.setState({
            token: json.token
          });
        }
        this.setState({
          SigninError: json.messege,
          isLoading: false
        });
      });
  }

  logout() {
    this.setState({
      isLoading: true
    });
    const { token } = this.state;
    fetch("/api/account/logout?token=" + token)
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoading: false,
          token: ""
        });
      });
  }
  //sample get req.
  // fetch('/api/counters')
  //   .then(res => res.json())
  //   .then(json => {
  //     this.setState({
  //       counters: json
  //     });
  //   });

  //Sample Post Req
  // fetch('/api/counters', { method: 'POST' })
  //   .then(res => res.json())
  //   .then(json => {
  //     let data = this.state.counters;
  //     data.push(json);

  //     this.setState({
  //       counters: data
  //     });
  //   });
  onTextBoxChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const {
      isLoading,
      token,
      SigninError,
      SignupError,
      SignInemail,
      SignInpassword,
      SignUpEmail,
      SignUpPassword,
      SignUpFN,
      SignUpLN
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>I am loading.</p>
        </div>
      );
    }

    if (!token) {
      return (
        <div>
          <div>
            <p>Sign in</p>
            {SigninError ? <p>{SigninError}r</p> : null}

            <input
              type="text"
              onChange={this.onTextBoxChange}
              placeholder="email"
              name="SignInemail"
              value={SignInemail}
            />

            <br />
            <input
              type="password"
              onChange={this.onTextBoxChange}
              placeholder="Password"
              name="SignInpassword"
              value={SignInpassword}
            />
            <br />
            <button onClick={this.signin}>SignIN</button>
            <br />
          </div>
          <br />
          <div>
            <p> Sign Up</p>
            {SignupError ? <p>{SignupError}</p> : null}
            <input
              type="text"
              onChange={this.onTextBoxChange}
              name="SignUpFN"
              placeholder="First Name"
              value={SignUpFN}
            />
            <br />
            <input
              type="text"
              onChange={this.onTextBoxChange}
              name="SignUpLN"
              placeholder="Last Name"
              value={SignUpLN}
            />
            <br />
            <input
              type="text"
              onChange={this.onTextBoxChange}
              placeholder="email"
              name="SignUpEmail"
              value={SignUpEmail}
            />
            <br />

            <input
              type="password"
              onChange={this.onTextBoxChange}
              placeholder="Password"
              name="SignUpPassword"
              value={SignUpPassword}
            />
            <br />
            <button onClick={this.signup}>Sign UP</button>
          </div>

          <div />

          <p>Sign up</p>
        </div>
      );
    }

    return (
      <>
        <p>Account</p>
        <br />
        <button onClick={this.logout}>Logout</button>
      </>
    );
  }
}

export default Home;
