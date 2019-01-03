import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

const noop = () => undefined;

class ReCaptcha extends Component {
  static defaultProps = {
    badge: "bottomright",
    hl: "en",
    inherit: true,
    isolated: false,
    onError: noop,
    onExpired: noop,
    onLoad: noop,
    onSuccess: noop,
    size: "normal",
    tabIndex: 0,
    theme: "light",
    type: "image"
  };
  static propTypes = {
    badge: PropTypes.oneOf(["bottomright", "bottomleft", "inline"]),
    inherit: PropTypes.bool,
    isolated: PropTypes.bool,
    onError: PropTypes.func,
    onExpired: PropTypes.func,
    onLoad: PropTypes.func,
    onSuccess: PropTypes.func,
    sitekey: PropTypes.string,
    size: PropTypes.oneOf(["compact", "normal", "invisible"]),
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    theme: PropTypes.oneOf(["dark", "light"])
  };
  isReady = () =>
    typeof window !== "undefined" && typeof window.grecaptcha !== "undefined";

  readyIntervalId = setInterval(() => this._updateReadyState(), 1000);
  recaptcha = createRef();

  state = {
    ready: this.isReady()
  };

  componentWillUnmount() {
    clearInterval(this.readyIntervalId);
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.ready && this.state.ready) {
      grecaptcha.ready(() => {
        this.widgetId = grecaptcha.render(
          this.recaptcha.current,
          {
            "error-callback": this.props.onError,
            "expired-callback": this.props.onExpired,
            badge: this.props.badge,
            callback: this.props.onSuccess,
            isolated: this.props.isolated,
            sitekey: this.props.sitekey,
            size: this.props.size,
            tabindex: this.props.tabIndex,
            theme: this.props.theme
          },
          this.props.inherit
        );
      });
    }
  }

  reset = () => {
    grecaptcha.reset(this.widgetId);
  };

  execute = () => {
    grecaptcha.execute(this.widgetId);
  };

  _updateReadyState = () => {
    if (this.isReady()) {
      this.setState(() => ({
        ready: true
      }));
      clearInterval(this.readyIntervalId);
      this.props.onLoad();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.ready && nextState.ready;
  }

  render() {
    const {
      onError,
      onExpired,
      onLoad,
      onSuccess,
      inherit,
      isolated,
      sitekey,
      theme,
      type,
      size,
      badge,
      tabIndex,
      ...rest
    } = this.props;

    return (
      <div
        ref={this.recaptcha}
        data-sitekey={sitekey}
        data-theme={theme}
        data-type={type}
        data-size={size}
        data-badge={badge}
        data-tabindex={tabIndex}
        {...rest}
      />
    );
  }
}

export default ReCaptcha;
