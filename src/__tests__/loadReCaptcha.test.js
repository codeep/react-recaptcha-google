"use strict";

import loadReCaptcha from "../loadReCaptcha";

test("loadReCaptcha - appends ony one script to the body", () => {
  document.body.innerHTML = "";
  loadReCaptcha();
  loadReCaptcha();
  expect(document.body.innerHTML).toEqual(
    '<script defer="" src="https://www.google.com/recaptcha/api.js?" id="recaptcha-script"></script>'
  );
});

test("loadReCaptcha - accepts params", () => {
  document.body.innerHTML = "";
  loadReCaptcha({ onload: "onload", render: "explicit", hl: "en" });
  expect(document.body.innerHTML).toEqual(
    '<script defer="" src="https://www.google.com/recaptcha/api.js?onload=onload&amp;render=explicit&amp;hl=en" id="recaptcha-script"></script>'
  );
});
