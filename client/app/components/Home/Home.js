import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../../utils/storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      SignupError: "",
      SigninError: ""
    };
  }

  componentDidMount() {
    const token = getFromStorage("login_token");

    if (token) {
      fetch("/api/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
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

  render() {
    const { isLoading, token } = this.state;

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
          <p>Sign in</p>
          <p>Sign up</p>
        </div>
      );
    }

    return (
      <>
        <p>Account</p>
      </>
    );
  }
}

export default Home;
