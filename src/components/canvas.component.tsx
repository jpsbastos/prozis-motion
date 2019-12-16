import * as React from 'react';
import { BallComponent } from './ball.component';
import { GlobalConstants } from './../constants/global-constants';
import { Utils } from './../utils/utils';
import './canvas.component.css'
import { IBall } from '../interfaces/ball.interface';

interface ICanvasState {
    balls: IBall[];
}
export class CanvasComponent extends React.Component {
    public state: ICanvasState = {
        /**
         * List of balls created so far
         */
        balls: [],
    };

    /**
     * Renders the canvas container with the current balls
     */
    public render(): JSX.Element {
        const { CANVAS_HEIGHT, CANVAS_WIDTH } = GlobalConstants;
        return (
            <React.Fragment>
                <div className="canvas" onClick={(ev) => this.addBall(ev)} style={{ height: CANVAS_HEIGHT, width: CANVAS_WIDTH}}>
                    {this.state.balls.map((b, i) => <BallComponent key={i} {...b}/>)}
                </div>
                <div>
                    <button className="clear-btn" onClick={() => this.resetSimulation()}>Clear Simulation</button>
                </div>
            </React.Fragment>
        )
    }

    /**
     * Creates a new ball at the clicked position (x, y) with random hslColor, diameter (in the given range), 
     * angle(direction) and velocity(which is decomposed in vx as vy) if possible.
     * @param ev mouseEvent
     */
    private addBall(ev: React.MouseEvent): void {
        const { MAX_DIAMETER, MIN_DIAMETER } = GlobalConstants;
        ev.preventDefault();
        const diameter = Utils.generateRandomValue(MAX_DIAMETER, MIN_DIAMETER);
        const { initialX, initialY } = this.getPosition(ev, diameter/2);
        
        // Checks if it is possible to add the balls with the diameter obtained previously at the current position
        if(this.isBallValid(initialX, initialY, diameter)) {
            const { initialVelocityX, initialVelocityY } = this.getVelocityByXY();
            const newBall: IBall = {
                diameter,
                hslColor: Utils.generateRandomValue(360),
                initialVelocityX,
                initialVelocityY,
                initialX,
                initialY,
            }
            this.setState({ balls: [...this.state.balls, newBall ]});
        } else {
            alert(`Invalid Ball!\nYou're trying to insert a ball with ${diameter}px at (${initialX}, ${initialY}).`);
        }
    }

    /**
     * Retrieves from the mouse event the current coordinates relative to the canvas container
     * @param ev mouseEvent
     * @param radius calculated radius
     */
    private getPosition(ev: React.MouseEvent, radius: number): { initialX: number, initialY: number } {
        return {
            initialX: ev.nativeEvent.offsetX - radius,
            initialY: GlobalConstants.CANVAS_HEIGHT - ev.nativeEvent.offsetY - radius,
        }
    }

    /**
     * Checks if its possible to insert a ball with diameter "diameter" at x, y, by checking if it fits
     * @param x x position
     * @param y y position
     * @param diameter diameter
     */
    private isBallValid(x: number, y: number, diameter: number): boolean {
        return x >= 0 && (x + diameter) <= GlobalConstants.CANVAS_WIDTH && y >= 0 && (y + diameter) <= GlobalConstants.CANVAS_HEIGHT;
    }

    /**
     * Generates the velocity and angle (direction) and decomposes the velocity in x and y axis using trigonometry
     */
    private getVelocityByXY(): { initialVelocityX: number, initialVelocityY: number } {
        // angle simulates direction
        const angle = Utils.degreesToRadians(Utils.generateRandomValue(360, 1));
        const velocity = Utils.generateRandomValue(100, 25);

        return { initialVelocityX: Math.abs(Math.cos(angle) * velocity), initialVelocityY: Math.abs(Math.sin(angle) * velocity) }
    }

    /**
     * Clears the balls list
     */
    private resetSimulation(): void {
        this.setState({ balls: []});
    }
}