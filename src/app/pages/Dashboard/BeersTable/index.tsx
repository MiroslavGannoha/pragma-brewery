import * as React from 'react';
import { Beer } from '../../../stores/BeersStore/models';
import { observer } from 'mobx-react-lite';
import hotIcon from '../../../../images/icons/hot.svg';
import coldIcon from '../../../../images/icons/cold.svg';
import classnames from 'classnames';

const headerClasses = 'px-4 py-2 font-semibold'
const rowsClasses = 'border px-4 py-2'

const BeersTable: React.FC<{ beers: Beer[] }> = observer(({ beers }) => {

    const beerRows = beers.map(
        ({
            id,
            type,
            temperature,
            minTemperature: min,
            maxTemperature: max,
        }) => {
            let temperatureClass = '';
            let statusIcon: null | string = null;

            if (
                typeof temperature === 'number' &&
                (temperature > max || temperature < min)
            ) {
                const isTooHot = temperature > max;
                temperatureClass = isTooHot ? 'text-red-600' : 'text-blue-600';
                statusIcon = isTooHot ? hotIcon : coldIcon;
            }

            return (
                <tr key={`row-${id}-${type}`}>
                    <td className={classnames(rowsClasses, temperatureClass)}>
                        {type}
                    </td>
                    <td className={classnames(rowsClasses, 'text-center')}>
                        {statusIcon ? (
                            <img
                                src={statusIcon}
                                alt="pragma beer status"
                                className="w-6 inline-block"
                            />
                        ): 'ok'}
                    </td>
                    <td
                        className={classnames(rowsClasses, 'text-center font-medium', temperatureClass)}
                    >
                        {temperature ?? 'n/a'}
                    </td>
                    <td className={classnames(rowsClasses, 'text-center hidden sm:table-cell')}>
                        {min} - {max}
                    </td>
                </tr>
            );
        }
    );

    return (
        <div className="overflow-x-auto">
            <table className="table-auto responsive sm:text-lg mx-auto">
                <thead>
                    <tr>
                        <th className={headerClasses}>Beer</th>
                        <th className={headerClasses}>Status</th>
                        <th className={headerClasses}>Temp, °C</th>
                        <th className={classnames(headerClasses, 'hidden sm:table-cell')}>Recommended, °C</th>
                    </tr>
                </thead>
                <tbody>{beerRows}</tbody>
            </table>
        </div>
    );
});

export default BeersTable;
