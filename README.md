# react-recaptcha-google

This component is created in order to make the experience of integrating Google ReCaptcha into React apps easier and smoother.

## Installation

`npm install react-recaptcha-google --save`

## Usage

There are two components that you need to use.

### 1. Use `loadReCaptcha()` to initialize the ReCaptcha

This function should be imported and called in the main (parent) component of your app. We recommend calling it in `componentDidMount()` of `App.js`.

```
import { loadReCaptcha } from 'react-recaptcha-google'

...

componentDidMount() {
  loadReCaptcha();
}
```


### 2. Use `ReCaptcha` to integrate ReCaptcha in a particular component
```
import React, { Component } from 'react';
import { ReCaptcha } from 'react-recaptcha-google'

class ExampleComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  componentDidMount() {
    if (this.captchaDemo) {
        console.log("started, just a second...")
        this.captchaDemo.reset();
        this.captchaDemo.execute();
    }
  }

  onLoadRecaptcha() {
      if (this.captchaDemo) {
          this.captchaDemo.reset();
          this.captchaDemo.execute();
      }
  }

  verifyCallback(recaptchaToken) {
    // Here you will get the final recaptchaToken!!!  
    console.log(recaptchaToken, "<= your recaptcha token")
  }

  render() {
    return (
      <div>
        {/* You can replace captchaDemo ref with whatever works for your component */}
        <ReCaptcha
            ref={(el) => {this.captchaDemo = el;}}
            size="invisible"
            render="explicit"
            sitekey="your_site_key"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
        />
        <code>
          1. Add <strong>your site key</strong> in the ReCaptcha component. <br/>
          2. Check <strong>console</strong> to see the token.
        </code>
      </div>
    );
  };
};

export default ExampleComponent;

```

P.S. It will open the ReCaptcha window only when there are some doubts by Google; otherwise, it will automatically generate the token.
