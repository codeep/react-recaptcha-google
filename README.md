# react-recaptcha-google

This component is created in order to make the experience of integrating Google ReCaptcha into React apps easier and smoother.

Currently, we are using ReCaptcha V2 here. ReCaptcha V3 is still in beta version; so, we will update our component when they release the stable version.

P.S. It will open the ReCaptcha window only when there are some doubts by Google; otherwise, it will automatically generate the recaptcha token.

## Installation

`npm install react-recaptcha-google --save`

## Usage

There are two components that you need to use.

### 1. Use `loadReCaptcha()` to initialize the ReCaptcha

This function should be imported and called in the main (parent) component of your app. We recommend calling it in `componentDidMount()` of `App.js`.

```js
import React, { Component } from "react";
import { loadReCaptcha } from "react-recaptcha-google";

class App extends Component {
  componentDidMount() {
    loadReCaptcha();
  }
}
```

### 2. Use `ReCaptcha` to integrate ReCaptcha in a particular component

#### invisible Recaptcha

```js
import React, { Component } from "react";
import { ReCaptcha } from "react-recaptcha-google";

export default class ExampleComponent extends Component {
  constructor(props) {
    super(props);
    this.recaptcha = React.createRef();
  }

  render() {
    return (
      <ReCaptcha
        ref={this.recaptcha}
        sitekey={"RECAPTCHA_SITEKEY"}
        // will be called as soon as available after `execute` call
        onSuccess={token => console.log(token)}
        size="invisible"
        onLoad={() => {
          // this can trigger image challenge
          // so it is better to call in when user submits form
          this.recaptcha.execute();
        }}
      />
    );
  }
}
```

#### Visible / Normal Recaptcha

```js
import React, { Component } from "react";
import { ReCaptcha } from "react-recaptcha-google";

export default class ExampleComponent extends Component {
  render() {
    return (
      <ReCaptcha
        sitekey={"RECAPTCHA_SITEKEY"}
        // will be called as soon as user passes challenge
        onSuccess={token => console.log(token)}
      />
    );
  }
}
```

#### Properties

| Property  | Type   | Required | Default     | Description                                                                                                                                                                                                                                                        |
| --------- | ------ | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| theme     | Enum   | false    | light       | Works with I'm not a robot challenge Optional. The color theme of the widget.                                                                                                                                                                                      |
| size      | Enum   | false    | normal      | invisible - stands for Invisible reCAPTCHA "compact", "normal" - stands for I'm not a robot challenge                                                                                                                                                              |
| tabIndex  | Number | false    | 0           | Optional. The tabIndex of the challenge. If other elements in your page use tabIndex, it should be set to make user navigation easier.                                                                                                                             |
| badge     | Enum   | false    | bottomright | Works with Invisible reCAPTCHA Optional. Reposition the reCAPTCHA badge. 'inline' lets you position it with CSS.                                                                                                                                                   |
| isolated  | Bool   | false    | true        | Works with Invisible reCAPTCHA Optional. For plugin owners to not interfere with existing reCAPTCHA installations on a page. If true, this reCAPTCHA instance will be part of a separate ID space.                                                                 |
| inherit   | Bool   | false    | false       | Use existing data-\* attributes on the element if the coorsponding parameter is not specified. The values in parameter will take precedence over the attributes.                                                                                                   |
| sitekey   | String | true     |             |                                                                                                                                                                                                                                                                    |
| onSuccess | Func   | false    |             | Optional. The callback function, executed when the user submits a successful response. The g-recaptcha-response token is passed to your callback.                                                                                                                  |
| onLoad    | Func   | false    |             | Optional. The callback function to be executed once all the dependencies have loaded.                                                                                                                                                                              |
| onExpired | Func   | false    |             | Optional. The callback function, executed when the reCAPTCHA response expires and the user needs to re-verify.                                                                                                                                                     |
| onError   | Func   | false    |             | Optional. The callback function, executed when reCAPTCHA encounters an error (usually network connectivity) and cannot continue until connectivity is restored. If you specify a function here, you are responsible for informing the user that they should retry. |

### 3. Save Google response into state or inside a hidden field

```js
export default class ExampleComponent extends Component {
  onSuccess(recaptchaToken) {
    this.setState({recaptchaToken});
  }
  render() {
    return (
      <input
        type="hidden"
        name="recaptchaResponse"
        value={this.state.recaptchaToken} />
      {/* ... */}
    )
  }
}
```

### 4. Implement code server side to validate the response

```ts
import * as request from 'request'; // from "web-request": "^1.0.7",

check(recaptchaResponse: string, remoteAddress: string): Promise<boolean> {
  const secretKey = "";
  return new Promise<boolean>((resolve, reject) => {
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + recaptchaResponse + '&remoteip=' + remoteAddress;
    request(verificationUrl, (error, response, body) => {
      if (error) return reject(false);
      if (response.statusCode !== 200) return reject(false);
      body = JSON.parse(body);
      const passCaptcha = !!body.success;
      resolve(passCaptcha);
    });
  });
}
```
