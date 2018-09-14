const serialize = obj => {
  let query = [];
  for (let prop in obj)
    if (obj.hasOwnProperty(prop)) {
      query.push(
        encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop])
      );
    }
  return query.join("&");
};

/**
 * https://developers.google.com/recaptcha/docs/display
 * @param {{ onload, render, hl}} props
 * onload - string. Optional. The name of your callback function to be executed once all the dependencies have loaded.
 * render - explicit | onload. Optional. Whether to render the widget explicitly. Defaults to onload, which will render the widget in the first g-recaptcha tag it finds.
 * hl - string. Optional. Forces the widget to render in a specific language. Auto-detects the user's language if unspecified.
 */
const loadReCaptcha = (props = {}) => {
  const id = "recaptcha-script";
  let script = document.getElementById(id);
  if (script != null) return;
  script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = "https://www.google.com/recaptcha/api.js?" + serialize(props);
  script.id = id;
  document.body.appendChild(script);
};

export default loadReCaptcha;
