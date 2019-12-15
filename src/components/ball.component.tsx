import * as React from 'react';
import './ball.component.css';
import { GlobalConstants } from './../constants/global-constants';

export interface IBallProps {
    diameter: number;
    hslColor: number;
    initialX: number;
    initialY: number;
    initialVelocityX: number;
    initialVelocityY: number;
}

const SECOND = 100;

export class BallComponent extends React.Component<IBallProps> {
    private interval: NodeJS.Timeout;

    public state = {
        time: 0,
        xVelocity: this.props.initialVelocityX,
        yVelocity: this.props.initialVelocityY,
        x: this.props.initialX,
        y: this.props.initialY,
    }

    public componentDidMount(): void {
        this.interval = setInterval(() => this.calculateCurrentPosition(), SECOND);
    }

    public componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    public render(): JSX.Element {
        return <div className="ball" style={this.getBallStyle()}/>;
    }

    private getBallStyle(): React.CSSProperties {
        return {
            background: `hsl(${this.props.hslColor}, 50%, 50%)`,
            height: this.props.diameter,
            width: this.props.diameter,
            left: `${this.state.x}px`,
            bottom: `${this.state.y}px`,
        }
    }

    private calculateCurrentPosition(): void {
        let { time } = this.state;
        // each interval increases the time by 0.1
        time += 0.1;
        let x = this.calculateX(time);
        let y = this.calculateY(time);

        if(y <= 0 || y >= GlobalConstants.CANVAS_HEIGHT) {
            y = -y;
        }

        this.setState({ time, x, y });
    }

    private calculateX(time: number): number {
        // Xinicial + Vx * T
        return this.props.initialX + this.state.xVelocity * time;
    }

    private calculateY(time: number): number {
        // Yinicial + Vinicial * T - 0.5 * A * T2
        return this.props.initialY + this.state.yVelocity * time - 0.5 * GlobalConstants.ACCELERATION * Math.pow(time, 2);
    }
}