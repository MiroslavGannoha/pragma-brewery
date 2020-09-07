import * as React from 'react';
import beerIcon from '../../../images/icons/beer.svg';

const PublicLayout: React.FC = ({ children }) => {
    return (
        <>
            <header className="bg-blue-500 text-white fixed w-full top-0 h-12 flex items-center justify-center text-xl">
                <a href="/" title="Pragma Brewery" className="inline-block">
                    <img
                        src={beerIcon}
                        alt="pragma beer"
                        className="mr-4 w-10 inline-block"
                    />
                    Pragma Brewery
                </a>
            </header>
            <main className="text-gray-700 pt-12 h-full">{children}</main>
        </>
    );
};

export default PublicLayout;
