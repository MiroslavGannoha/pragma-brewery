import * as React from 'react';
import classnames from 'classnames';
const Container: React.FC<React.HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...otherProps
}) => {
    return (
        <div
            className={classnames(
                'bg-white rounded overflow-hidden shadow-lg w-full',
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    );
};

const Header: React.FC<React.HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...otherProps
}) => {
    return (
        <div className={classnames('w-full', className)} {...otherProps}>
            {children}
        </div>
    );
};

const Body: React.FC<React.HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...otherProps
}) => {
    return (
        <div className={classnames("px-4 py-4 md:px-6 md:py-4", className)} {...otherProps}>
            <div className="text-gray-700 text-base" >
                {children}
            </div>
        </div>
    );
};

const Title: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, className, ...otherProps }) => {
    return (
        <div className={classnames("font-semibold text-2xl mb-2", className)} {...otherProps}>
            {children}
        </div>
    );
};

const Footer: React.FC<React.HTMLProps<HTMLDivElement>> = ({
    children,
    className,
    ...otherProps
}) => {
    return (
        <div className={classnames("px-6 pt-4 pb-2", className)} {...otherProps}>
            {children}
        </div>
    );
};

export const Card = {
    Container,
    Header,
    Body,
    Title,
    Footer,
};
