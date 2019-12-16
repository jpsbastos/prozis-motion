import * as React from 'react';
import './ball.component.css';
import { GlobalConstants } from './../constants/global-constants';
import { IBall } from '../interfaces/ball.interface';

export class BallComponent extends React.Component<IBall> {
    private timeOut: NodeJS.Timeout;

    public state = {
        /**
         * time since ball launch
         */
        time: new Date().getTime(),
        /**
         * velocity (x axis)
         */
        xVelocity: this.props.initialVelocityX,
        /**
         * velocity (y axis)
         */
        yVelocity: this.props.initialVelocityY,
        /**
         * current position (x axis)
         */
        x: this.props.initialX,
        /**
         * current position (y axis)
         */
        y: this.props.initialY,
    }

    /**
     * When the component is mounted (DOM is ready)
     * calculates the calculateCurrentPosition
     */
    public componentDidMount(): void {
        this.timeOut = setTimeout(() => this.calculateCurrentPosition(), 1);
    }

    /**
     * When the component will be removed from the DOM
     */
    public componentWillUnmount(): void {
        clearInterval(this.timeOut);
    }

    /**
     * Renders the ball
     */
    public render(): JSX.Element {
        return <div className="ball" style={this.getBallStyle()}/>;
    }

    /**
     * Returns the ball style
     */
    private getBallStyle(): React.CSSProperties {
        return {
            background: `hsl(${this.props.hslColor}, 50%, 50%)`,
            height: this.props.diameter,
            width: this.props.diameter,
            left: `${this.state.x}px`,
            bottom: `${this.state.y}px`,
        }
    }

    /**
     * Calculates the ball's current position by the following order:
     * 1. Calculates the delta time
     * 2. Calculates the current x and y
     * 3. Check if the the previous values of x / y are out of bounds and in that case the velocity's signal in the respective
     * axis is reversed and decreased by 10% as well as the x / y is set to the closest valid point of the wall where the collision happened.
     * 4. The component's state is updated and a new calculateCurrentPosition is added to the event queue.
     */
    private calculateCurrentPosition(): void {
        let { time, x, xVelocity, y, yVelocity } = this.state;
        // each interval increases the time by 0.1
        const newTime = new Date().getTime();
        const diff = 1 / (newTime - time); 

        x = this.calculateX(diff);
        y = this.calculateY(diff);

        if((y <= 0) || ((y + this.props.diameter) >= GlobalConstants.CANVAS_HEIGHT)) {
            yVelocity = -yVelocity;
            yVelocity -= (yVelocity * GlobalConstants.VELOCITY_DECREASE_FACTOR);
            // Since y is the distance to the bottom, when the ball hits the bottom, y should be 0, but if it hits the top
            // y should be equal to the canvas height minus diameter
            y = y < 0 ? 0 : (GlobalConstants.CANVAS_HEIGHT - this.props.diameter);
        }

        if((x <= 0) || ((x + this.props.diameter) >= GlobalConstants.CANVAS_WIDTH)) {
            xVelocity = -xVelocity;
            xVelocity -= (xVelocity * GlobalConstants.VELOCITY_DECREASE_FACTOR);
            // Since x is the distance to the left, when the ball hits the left, x should be 0, but if it hits the right 
            // x should be equal to the canvas width minus diameter
            x = x < 0 ? 0 : (GlobalConstants.CANVAS_WIDTH - this.props.diameter);
        }

        this.setState({ time: newTime, x, xVelocity, y, yVelocity }, () =>
            this.updateBallPosition());
    }

    /**
     * Updates the ball position by calling the calculate current position method, 
     * 0 seconds after the event queue is available
     */
    private updateBallPosition(): void {
        this.timeOut = setTimeout(() => this.calculateCurrentPosition(), 0);
    }

    /**
     * Given a delta time calculates the current position in X
     * (X = Xinicial + Vx * T)
     * @param time delta time
     */
    private calculateX(time: number): number {
        return this.state.x + this.state.xVelocity * time;
    }

    /**
     * Given a delta time calculates the current position in Y
     * (Y = Yinicial + Vy * T - 0.5 * A * T2)
     * @param time delta time
     */
    private calculateY(time: number): number {
        return this.state.y + this.state.yVelocity * time - 0.5 * GlobalConstants.ACCELERATION * Math.pow(time, 2);
    }
}