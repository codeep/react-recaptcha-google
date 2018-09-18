import React, { Component } from "react";
import { loadReCaptcha, ReCaptcha } from "react-recaptcha-google";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    ready: false
  };
  recaptcha = React.createRef();
  componentDidMount() {
    loadReCaptcha();
  }
  componentDidUpdate() {
    if (this.state.ready) {
      // use for size="invisible"
      // this.recaptcha.current.execute();
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ReCaptcha
          ref={this.recaptcha}
          sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITEKEY}
          onSuccess={token => console.log(token)}
          onError={console.error.bind(console)}
          onExpired={console.error.bind(console)}
          onLoad={() => {
            console.log("loaded");
            this.setState({ ready: true });
          }}
        />
      </div>
    );
  }
}

export default App;
