import React, { Component } from "react";
import PropTypes from "prop-types";

const isReady = () =>
  typeof window !== "undefined" &&
  window.grecaptcha !== undefined &&
  // need to check for presence of render, because reCaptcha creates { ready } first
  !!window.grecaptcha.render;

const defaultProps = {
  theme: "light",
  size: "normal",
  tabIndex: 0,
  badge: "bottomright",
  isolated: true,
  inherit: false
};

const propTypes = {
  sitekey: PropTypes.string.isRequired,
  /** Optional. The callback function, executed when the user submits a successful response. The g-recaptcha-response token is passed to your callback. */
  onSuccess: PropTypes.func,
  /** Optional. The callback function to be executed once all the dependencies have loaded. */
  onLoad: PropTypes.func,
  /** Optional. The callback function, executed when the reCAPTCHA response expires and the user needs to re-verify. */
  onExpired: PropTypes.func,
  /** Optional. The callback function, executed when reCAPTCHA encounters an error (usually network connectivity) and cannot continue until connectivity is restored. If you specify a function here, you are responsible for informing the user that they should retry. */
  onError: PropTypes.func,
  /** Optional. The tabIndex of the challenge. If other elements in your page use tabIndex, it should be set to make user navigation easier. */
  tabIndex: PropTypes.number,
  /** "invisible" - stands for Invisible reCAPTCHA
   *  "compact", "normal" - stands for I'm not a robot challenge */
  size: PropTypes.oneOf(["compact", "normal", "invisible"]),
  /** Works with I'm not a robot challenge
   *  Optional. The color theme of the widget. */
  theme: PropTypes.oneOf(["dark", "light"]),
  /** Works with Invisible reCAPTCHA
   *  Optional. Reposition the reCAPTCHA badge. 'inline' lets you position it with CSS. */
  badge: PropTypes.oneOf(["bottomright", "bottomleft", "inline"]),
  /** Works with Invisible reCAPTCHA
   *  Optional. For plugin owners to not interfere with existing reCAPTCHA installations on a page. If true, this reCAPTCHA instance will be part of a separate ID space. */
  isolated: PropTypes.bool,
  /** Use existing data-* attributes on the element if the coorsponding parameter is not specified. The values in parameter will take precedence over the attributes. */
  inherit: PropTypes.bool
};

class ReCaptcha extends Component {
  constructor(props) {
    super(props);
    this.recaptcha = null;
    this._setRecaptcha = this._setRecaptcha.bind(this);
    this.widget = null;
    this.reset = this.reset.bind(this);
    this.execute = this.execute.bind(this);
    this._updateReadyState = this._updateReadyState.bind(this);
    this._renderGrecaptcha = this._renderGrecaptcha.bind(this);
  }

  componentDidMount() {
    if (!isReady()) {
      this.readyCheck = setInterval(this._updateReadyState, 500);
    }
  }

  componentWillUnmount() {
    clearInterval(this.readyCheck);
  }

  _setRecaptcha(recaptcha) {
    this.recaptcha = recaptcha;
    if (isReady() && this.recaptcha) {
      this._renderGrecaptcha();
    }
  }

  _updateReadyState() {
    if (isReady()) {
      clearInterval(this.readyCheck);
      if (this.recaptcha) this._renderGrecaptcha();
    }
  }

  _renderGrecaptcha() {
    const {
      sitekey,
      onSuccess,
      theme,
      type,
      size,
      tabIndex,
      badge,
      onError,
      onExpired,
      inherit
    } = this.props;
    this.widget = window.grecaptcha.render(
      this.recaptcha,
      {
        sitekey,
        callback: onSuccess,
        theme,
        type,
        size,
        tabindex: tabIndex,
        badge,
        "error-callback": onError,
        "expired-callback": onExpired
      },
      inherit
    );
    const { onLoad } = this.props;
    if (onLoad) onLoad();
  }

  reset() {
    if (isReady() && this.widget !== null) window.grecaptcha.reset(this.widget);
  }

  execute() {
    if (this.props.size !== "invisible") {
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          'You need to use `execute` only for `size="invisible"`'
        );
      }
      // otherwise user will se confusing error: A cross-origin error was thrown
      return;
    }
    if (isReady() && this.widget !== null)
      window.grecaptcha.execute(this.widget);
  }

  render() {
    const {
      sitekey,
      onSuccess,
      onLoad,
      onExpired,
      onError,
      tabIndex,
      size,
      theme,
      badge,
      isolated,
      inherit
    } = this.props;
    return (
      <div
        ref={this._setRecaptcha}
        data-sitekey={sitekey}
        data-theme={theme}
        data-size={size}
        data-badge={badge}
        data-tabindex={`${tabIndex}`}
      />
    );
  }
}

ReCaptcha.defaultProps = defaultProps;
ReCaptcha.propTypes = propTypes;

export default ReCaptcha;
