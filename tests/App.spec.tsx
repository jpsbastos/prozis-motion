import * as React from 'react';
import { shallow } from 'enzyme';

jest.mock('./../src/components/canvas.component', () => ({
    CanvasComponent: (props) => MockComponent('canvas', props),
}));

import App from './../src/App';
import { MockComponent } from './../src/utils/mock.component';


describe('App', () => {
    let result: string;

    beforeEach(() => result = shallow(<App />).html());
    it('should return the right html', () => {
        expect(result).toEqual('<div class="App"><h1>Projectile Motion</h1><div class="canvas"></div></div>')
    });
});
