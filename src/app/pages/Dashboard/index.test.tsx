import React from 'react';
import Dashboard from './';
import { shallow } from 'enzyme';

it('should render correctly', () => {
    const component = shallow(<Dashboard />);

    expect(component).toMatchSnapshot();
});
