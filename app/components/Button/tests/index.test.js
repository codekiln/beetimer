import React from 'react';
import { shallow } from 'enzyme';

import Button from '../index';

function sampleClickHandler() {
  return true;
}

describe('<Button />', () => {
  it('renders a <button>', () => {
    const renderedComponent = shallow(
      <Button onClick={sampleClickHandler} />
    );
    expect(
      renderedComponent.find('button').node
    ).toBeDefined();
  });

  it('renders its children', () => {
    const text = 'Click me!';
    const renderedComponent = shallow(
      <Button onClick={sampleClickHandler} >{text}</Button >
    );
    expect(
      renderedComponent.contains(text)
    ).toEqual(true);
  });

  it('handles clicks', () => {
    const onClickSpy = jest.fn();
    const renderedComponent = shallow(<Button onClick={onClickSpy} />);
    renderedComponent.find('button').simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });
});
