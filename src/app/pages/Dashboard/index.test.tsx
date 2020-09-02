import React from 'react';
import Dashboard from './';
// import { shallow } from 'enzyme';
import {render} from '@testing-library/react';

it('should render correctly', () => {
    const {getByText} = render(<Dashboard />);

    expect(getByText('Dashboard')).toBeVisible();
});
