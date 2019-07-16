import React, { Component } from "react";
import "whatwg-fetch";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counters: []
    };
  }

  componentDidMount() {
    // fetch('/api/counters')
    //   .then(res => res.json())
    //   .then(json => {
    //     this.setState({
    //       counters: json
    //     });
    //   });
  }

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
    return (
      <>
        <p>Counters:</p>

        <ul>
          {this.state.counters.map((counter, i) => (
            <li key={i}>
              <span>{counter.count} </span>
              <button onClick={() => this.incrementCounter(i)}>+</button>
              <button onClick={() => this.decrementCounter(i)}>-</button>
              <button onClick={() => this.deleteCounter(i)}>x</button>
            </li>
          ))}
        </ul>

        <button onClick={this.newCounter}>New counter</button>
      </>
    );
  }
}

export default Home;
