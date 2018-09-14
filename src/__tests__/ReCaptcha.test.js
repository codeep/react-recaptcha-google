import React from "react";
import renderer from "react-test-renderer";
import ReCaptcha from "../ReCaptcha";

const pause = time => new Promise(resolve => setTimeout(resolve, time));

const mockGlobal = grecaptcha => {
  window.grecaptcha = {
    render: jest.fn(),
    ...grecaptcha
  };
};
const resetMock = () => {
  window.grecaptcha = undefined;
};

const subject = (options = {}) =>
  renderer.create(<ReCaptcha sitekey="test" {...options} />, {
    createNodeMock: element => ({ type: `mock-${element.type}` })
  });

describe("ReCaptcha", () => {
  afterEach(resetMock);

  test("render", () => {
    const component = subject();
    expect(component.toJSON()).toMatchSnapshot();
    component.unmount();
  });

  test("onLoad, preloaded", () => {
    const onLoad = jest.fn();
    const render = jest.fn();
    mockGlobal({ render });
    const component = subject({ onLoad });
    // it calls onLoad as soon as it mounted
    expect(onLoad.mock.calls.length).toEqual(1);
    // it calls grecaptcha.render
    expect(render.mock.calls.length).toEqual(1);
    expect(render.mock.calls).toMatchSnapshot();
    component.unmount();
  });

  test("onLoad, initially not loaded", async () => {
    const onLoad = jest.fn();
    const component = subject({ onLoad });
    expect(onLoad.mock.calls.length).toEqual(0);
    const render = jest.fn();
    mockGlobal({ render });
    // it waits for grecaptcha to load
    await pause(510);
    expect(onLoad.mock.calls.length).toEqual(1);
    // it calls grecaptcha.render
    expect(render.mock.calls.length).toEqual(1);
    expect(render.mock.calls).toMatchSnapshot();
    component.unmount();
  });

  test("reset", () => {
    const reset = jest.fn();
    mockGlobal({ reset });
    const component = subject();
    component.getInstance().reset();
    // it calls grecaptcha.reset
    expect(reset.mock.calls.length).toEqual(1);
    expect(reset.mock.calls).toMatchSnapshot();
    component.unmount();
  });

  test("execute for visible", () => {
    const execute = jest.fn();
    mockGlobal({ execute });
    const component = subject();
    try {
      component.getInstance().execute();
    } catch (e) {
      expect(e.message).toEqual(
        'You need to use `execute` only for `size="invisible"`'
      );
    }
    // it doesn't call grecaptcha.execute
    expect(execute.mock.calls.length).toEqual(0);
    component.unmount();
  });

  test("execute for invisible", () => {
    const execute = jest.fn();
    mockGlobal({ execute });
    const component = subject({ size: "invisible" });
    component.getInstance().execute();
    // it calls grecaptcha.execute
    expect(execute.mock.calls.length).toEqual(1);
    expect(execute.mock.calls).toMatchSnapshot();
    component.unmount();
  });
});
