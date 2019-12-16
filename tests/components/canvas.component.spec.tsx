import * as React from 'react';
import { shallow, mount, ReactWrapper, ShallowWrapper } from 'enzyme';

jest.mock('./../../src/components/ball.component', () => ({
    BallComponent: (props) => MockComponent('ball', props),
}));

import { CanvasComponent } from './../../src/components/canvas.component';
import { MockComponent } from './../../src/utils/mock.component';
import { Utils } from './../../src/utils/utils';
import { GlobalConstants } from './../../src/constants/global-constants';

describe('CanvasComponent', () => {
    let component: CanvasComponent;

    beforeEach(() => {
        component = new CanvasComponent({});
    });

    describe('#render', () => {
        let spyAddBall: jasmine.Spy;
        let spyResetSimulation: jasmine.Spy;
        let wrapper: ShallowWrapper;
        let result: string;

        beforeEach(() => {
            spyAddBall = spyOn(component as any, 'addBall');
            spyResetSimulation = spyOn(component as any, 'resetSimulation');
            component.state.balls = [
                {
                    diameter: 25,
                    hslColor: 100,
                    initialVelocityX: 5,
                    initialVelocityY: 10,
                    initialX: 15,
                    initialY: 15,
                },
                {
                    diameter: 35,
                    hslColor: 50,
                    initialVelocityX: 15,
                    initialVelocityY: 10,
                    initialX: 25,
                    initialY: 35,
                }
            ]
            wrapper = shallow(<div>{component.render()}</div>);
            result = wrapper.html();
        })
        
        it('should call addBall', () => {
            wrapper.find('.canvas').simulate('click');
            expect(spyAddBall).toHaveBeenCalled();
        });

        it('should call resetSimulation', () => {
            wrapper.find('.clear-btn').simulate('click');
            expect(spyResetSimulation).toHaveBeenCalled();
        });

        it('should return the right html', () => {
            expect(result).toEqual('<div><div class=\"canvas\" style=\"height:600px;width:800px\"><div class=\"ball\" prop-diameter=\"25\" prop-hslcolor=\"100\" prop-initialvelocityx=\"5\" prop-initialvelocityy=\"10\" prop-initialx=\"15\" prop-initialy=\"15\"></div><div class=\"ball\" prop-diameter=\"35\" prop-hslcolor=\"50\" prop-initialvelocityx=\"15\" prop-initialvelocityy=\"10\" prop-initialx=\"25\" prop-initialy=\"35\"></div></div><div><button class=\"clear-btn\">Clear Simulation</button></div></div>');
        });
    });

    describe('#addBall', () => {
        let ev: { preventDefault: () => void };
        let spyPreventDefault: jasmine.Spy;
        let spyUtilsGenerateRandomValue: jasmine.Spy;
        let spyIsBallValid: jasmine.Spy;
        let spyGetPosition: jasmine.Spy;
        let spyGetVelocityByXY: jasmine.Spy;
        let spySetState: jasmine.Spy;
        let spyAlert: jasmine.Spy;

        beforeEach(() => {
            ev = { preventDefault: jest.fn(() => {}) };
            spyPreventDefault = spyOn(ev, 'preventDefault');
            spyUtilsGenerateRandomValue = spyOn(Utils, 'generateRandomValue').and.returnValues(35, 50);
            spyIsBallValid = spyOn(component as any, 'isBallValid');
            spyGetPosition = spyOn(component as any, 'getPosition').and.returnValue({ initialX: 10, initialY: 20 });
            spyGetVelocityByXY = spyOn(component as any, 'getVelocityByXY')
                .and.returnValue({ initialVelocityX: 5, initialVelocityY: 10 });
            spySetState = spyOn(component, 'setState');
            spyAlert = spyOn(window, 'alert');
        });

        describe('when isBallValid returns true', () => {
            beforeEach(() => {
                spyIsBallValid.and.returnValue(true);
                component['addBall'](ev as any);
            });

            it('should call preventDefault', () => {
                expect(spyPreventDefault).toHaveBeenCalled();
            });

            it('should call getPosition', () => {
                expect(spyGetPosition).toHaveBeenCalledWith(ev as any, 35/2);
            });

            it('should call getVelocityByXY', () => {
                expect(spyGetVelocityByXY).toHaveBeenCalled();
            });

            it('should call generateRandomValue 2x', () => {
                expect(spyUtilsGenerateRandomValue).toHaveBeenCalledTimes(2);
                expect(spyUtilsGenerateRandomValue).toHaveBeenCalledWith(GlobalConstants.MAX_DIAMETER, GlobalConstants.MIN_DIAMETER);
                expect(spyUtilsGenerateRandomValue).toHaveBeenCalledWith(360);
            });

            it('should call setState', () => {
                const newBall = {
                    diameter: 35,
                    hslColor: 50,
                    initialVelocityX: 5,
                    initialVelocityY: 10,
                    initialX: 10,
                    initialY: 20,
                };
                expect(spySetState).toHaveBeenCalledWith({ balls: [ newBall ] });
            });

            it('should not call alert', () => {
                expect(spyAlert).not.toHaveBeenCalled();
            });
        });

        describe('when isBallValid returns false', () => {
            beforeEach(() => {
                spyIsBallValid.and.returnValue(false);
                component['addBall'](ev as any);
            });

            it('should call preventDefault', () => {
                expect(spyPreventDefault).toHaveBeenCalled();
            });

            it('should call getPosition', () => {
                expect(spyGetPosition).toHaveBeenCalledWith(ev as any, 35/2);
            });

            it('should not call getVelocityByXY', () => {
                expect(spyGetVelocityByXY).not.toHaveBeenCalled();
            });

            it('should call generateRandomValue 1x', () => {
                expect(spyUtilsGenerateRandomValue).toHaveBeenCalledTimes(1);
                expect(spyUtilsGenerateRandomValue).toHaveBeenCalledWith(GlobalConstants.MAX_DIAMETER, GlobalConstants.MIN_DIAMETER);
            });

            it('should not call setState', () => {
                expect(spySetState).not.toHaveBeenCalled();
            });

            it('should call alert', () => {
                expect(spyAlert).toHaveBeenCalledWith('Invalid Ball!\nYou\'re trying to insert a ball with 35px at (10, 20).');
            });
        });
    });
});
