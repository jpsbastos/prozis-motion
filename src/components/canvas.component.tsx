import * as React from 'react';
import { IBallProps, BallComponent } from './ball.component';
import { GlobalConstants } from './../constants/global-constants';
import { Utils } from './../utils/utils';
import './canvas.component.css'

interface ICanvasState {
    balls: IBallProps[];
}
export class CanvasComponent extends React.Component {
    public state: ICanvasState = {
        balls: []
    };

    public constructor(props: React.Props<{}>) {
        super(props);
    }

    public render(): JSX.Element {
        const { CANVAS_HEIGHT, CANVAS_WIDTH } = GlobalConstants;
        return (
            <div className="canvas" onClick={(ev) => this.addBall(ev)} style={{ height: CANVAS_HEIGHT, width: CANVAS_WIDTH}}>
                {this.state.balls.map((b, i) => <BallComponent key={i} {...b}/>)}
            </div>
        )
    }

    private addBall(ev: React.MouseEvent): void {
            const { MAX_DIAMETER, MIN_DIAMETER } = GlobalConstants;
            ev.preventDefault();
            const diameter = Utils.generateRandomValue(MAX_DIAMETER, MIN_DIAMETER);
            const { initialX, initialY } = this.getPosition(ev, diameter/2);
            
            if(this.isBallValid(initialX, initialY, diameter)) {
                const { initialVelocityX, initialVelocityY } = this.getVelocityByXY();
                const newBall: IBallProps = {
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

    private getPosition(ev: React.MouseEvent, radius: number): { initialX: number, initialY: number } {
        return {
            initialX: ev.nativeEvent.offsetX - radius,
            initialY: GlobalConstants.CANVAS_HEIGHT - ev.nativeEvent.offsetY - radius,
        }
    }

    private isBallValid(x: number, y: number, diameter: number): boolean {
        return x >= 0 && (x + diameter) <= GlobalConstants.CANVAS_WIDTH && y >= 0 && (y + diameter) <= GlobalConstants.CANVAS_HEIGHT;
    }

    private getVelocityByXY(): { initialVelocityX: number, initialVelocityY: number } {
        const angle = Utils.degreesToRadians(Utils.generateRandomValue(360, 1));
        //devera ser aleatoria
        const velocity = 50;

        return { initialVelocityX: Math.abs(Math.cos(angle) * velocity), initialVelocityY: Math.abs(Math.sin(angle) * velocity) }
    }
}