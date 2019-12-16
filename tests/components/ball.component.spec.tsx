import * as React from 'react';
import { BallComponent } from './../../src/components/ball.component';
import { shallow } from 'enzyme';
import { GlobalConstants } from './../../src/constants/global-constants';

describe('BallComponent', () => {
    let component: BallComponent;

    beforeEach(() => {
        component = new BallComponent({
            diameter: 20,
            hslColor: 10,
            initialVelocityX: 5,
            initialVelocityY: 10,
            initialX: 0,
            initialY: 0,
        });
    });

    describe('#render', () => {
        let spyGetBallStyle: jasmine.Spy;
        let result: string;

        beforeEach(() => {
            spyGetBallStyle = spyOn(component as any, 'getBallStyle').and.returnValue({
                height: '100px',
            });
            result = shallow(<div>{component.render()}</div>).html();
        })

        it('should call getBallStyle', () => {
            expect(spyGetBallStyle).toHaveBeenCalled();
        });

        it('should return the right html', () => {
            expect(result).toEqual('<div><div class="ball" style="height:100px"></div></div>');
        });
    });

    describe('#calculateCurrentPosition', () => {
        let spyGetTime: jasmine.Spy;
        let spyCalculateX: jasmine.Spy;
        let spyCalculateY: jasmine.Spy;
        let spyUpdateBallPosition: jasmine.Spy;
        let spySetState: jasmine.Spy;
        let newTime: number;

        beforeEach(() => {
            component.state.xVelocity = 10;
            component.state.yVelocity = 20;
            component.state.time = 1576513250950;
            newTime = 1576513250958;
            spyGetTime = spyOn(Date.prototype, 'getTime').and.returnValue(newTime);
            spyCalculateX = spyOn(component as any, 'calculateX');
            spyCalculateY = spyOn(component as any, 'calculateY');
            spyUpdateBallPosition = spyOn(component as any, 'updateBallPosition');
            spySetState = spyOn(component as any, 'setState');
        });

        describe('when both x and y are inside the canvas bounds', () => {
            beforeEach(() => {
                spyCalculateX.and.returnValue(100);
                spyCalculateY.and.returnValue(50);
                component['calculateCurrentPosition']();
            });

            it('should call getTime', () => {
                expect(spyGetTime).toHaveBeenCalled();
            });

            it('should call calculateX', () => {
                expect(spyCalculateX).toHaveBeenCalledWith(1/(newTime - component.state.time));
            });

            it('should call calculateY', () => {
                expect(spyCalculateY).toHaveBeenCalledWith(1/(newTime - component.state.time));
            });

            it('should call setState with equal previous and current velocities', () => {
                expect(spySetState).toHaveBeenCalledWith({
                    time: 1576513250958,
                    x: 100,
                    xVelocity: component.state.xVelocity,
                    y: 50,
                    yVelocity: component.state.yVelocity,
                }, jasmine.any(Function));
                spySetState.calls.first().args[1]();
                expect(spyUpdateBallPosition).toHaveBeenCalled();
            });
        });

        describe('when only x is inside the canvas bounds', () => {
            beforeEach(() => spyCalculateX.and.returnValue(100)); 

            describe('when y <= 0', () => {
                beforeEach(() => {
                    spyCalculateY.and.returnValue(-2);
                    component['calculateCurrentPosition']();
                });

                it('should call getTime', () => {
                    expect(spyGetTime).toHaveBeenCalled();
                });
    
                it('should call calculateX', () => {
                    expect(spyCalculateX).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call calculateY', () => {
                    expect(spyCalculateY).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call setState with equal previous and current velocities', () => {
                    expect(spySetState).toHaveBeenCalledWith({
                        time: 1576513250958,
                        x: 100,
                        xVelocity: component.state.xVelocity,
                        y: 0,
                        yVelocity: component.state.yVelocity * -0.9,
                    }, jasmine.any(Function));
                    spySetState.calls.first().args[1]();
                    expect(spyUpdateBallPosition).toHaveBeenCalled();
                });
            });

            describe('when y + diameter > canvas height ', () => {
                beforeEach(() => {
                    spyCalculateY.and.returnValue(GlobalConstants.CANVAS_HEIGHT);
                    component['calculateCurrentPosition']();
                });

                it('should call getTime', () => {
                    expect(spyGetTime).toHaveBeenCalled();
                });
    
                it('should call calculateX', () => {
                    expect(spyCalculateX).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call calculateY', () => {
                    expect(spyCalculateY).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call setState with equal previous and current velocities', () => {
                    expect(spySetState).toHaveBeenCalledWith({
                        time: 1576513250958,
                        x: 100,
                        xVelocity: component.state.xVelocity,
                        y: GlobalConstants.CANVAS_HEIGHT - component.props.diameter,
                        yVelocity: component.state.yVelocity * -0.9,
                    }, jasmine.any(Function));
                    spySetState.calls.first().args[1]();
                    expect(spyUpdateBallPosition).toHaveBeenCalled();
                });
            });
        });

        describe('when only y is inside the canvas bounds', () => {
            beforeEach(() => spyCalculateY.and.returnValue(100)); 

            describe('when x <= 0', () => {
                beforeEach(() => {
                    spyCalculateX.and.returnValue(-2);
                    component['calculateCurrentPosition']();
                });

                it('should call getTime', () => {
                    expect(spyGetTime).toHaveBeenCalled();
                });
    
                it('should call calculateX', () => {
                    expect(spyCalculateX).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call calculateY', () => {
                    expect(spyCalculateY).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call setState with equal previous and current velocities', () => {
                    expect(spySetState).toHaveBeenCalledWith({
                        time: 1576513250958,
                        x: 0,
                        xVelocity: component.state.xVelocity * -0.9,
                        y: 100,
                        yVelocity: component.state.yVelocity,
                    }, jasmine.any(Function));
                    spySetState.calls.first().args[1]();
                    expect(spyUpdateBallPosition).toHaveBeenCalled();
                });
            });

            describe('when y + diameter > canvas height ', () => {
                beforeEach(() => {
                    spyCalculateX.and.returnValue(GlobalConstants.CANVAS_WIDTH);
                    component['calculateCurrentPosition']();
                });

                it('should call getTime', () => {
                    expect(spyGetTime).toHaveBeenCalled();
                });
    
                it('should call calculateX', () => {
                    expect(spyCalculateX).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call calculateY', () => {
                    expect(spyCalculateY).toHaveBeenCalledWith(1/(newTime - component.state.time));
                });
    
                it('should call setState with equal previous and current velocities', () => {
                    expect(spySetState).toHaveBeenCalledWith({
                        time: 1576513250958,
                        x: GlobalConstants.CANVAS_WIDTH - component.props.diameter,
                        xVelocity: component.state.xVelocity * -0.9,
                        y: 100,
                        yVelocity: component.state.yVelocity,
                    }, jasmine.any(Function));
                    spySetState.calls.first().args[1]();
                    expect(spyUpdateBallPosition).toHaveBeenCalled();
                });
            });
        });

        describe('when neither x nor y are inside the canvas bounds', () => {
            beforeEach(() => {
                spyCalculateX.and.returnValue(-100);
                spyCalculateY.and.returnValue(-50);
                component['calculateCurrentPosition']();
            });

            it('should call getTime', () => {
                expect(spyGetTime).toHaveBeenCalled();
            });

            it('should call calculateX', () => {
                expect(spyCalculateX).toHaveBeenCalledWith(1/(newTime - component.state.time));
            });

            it('should call calculateY', () => {
                expect(spyCalculateY).toHaveBeenCalledWith(1/(newTime - component.state.time));
            });

            it('should call setState with equal previous and current velocities', () => {
                expect(spySetState).toHaveBeenCalledWith({
                    time: 1576513250958,
                    x: 0,
                    xVelocity: component.state.xVelocity * -0.9,
                    y: 0,
                    yVelocity: component.state.yVelocity * -0.9,
                }, jasmine.any(Function));
                spySetState.calls.first().args[1]();
                expect(spyUpdateBallPosition).toHaveBeenCalled();
            });
        });
    });
});
