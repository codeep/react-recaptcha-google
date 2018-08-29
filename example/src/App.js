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
    // console.log(window.grecaptcha);
    // this.recaptcha.current.reset();
  }
  componentDidUpdate() {
    if (this.state.ready) {
      this.recaptcha.current.reset();
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ReCaptcha
          ref={this.recaptcha}
          sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITEKEY}
          onSuccess={token => console.log(token)}
          onError={console.error.bind(console)}
          onLoad={() => {
            this.setState({ ready: true });
          }}
        />
      </div>
    );
  }
}

export default App;
