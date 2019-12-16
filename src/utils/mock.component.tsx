import * as React from 'react';

export function MockComponent(className: string, props: { [key: string]: unknown } = {} ): JSX.Element {
    const processedProps = {};

    Object.keys(props).forEach((key) => {
        const value = props[key];
        processedProps[key === 'className' ? key: `prop-${key.toLowerCase()}`] = value;
    });

    return <div className={className} {...processedProps}/>;
}