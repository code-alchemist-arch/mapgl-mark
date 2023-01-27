import React, { useCallback, useContext, useMemo, useState } from 'react';
import classNames from 'classnames';

import { ReactComponent as ArrowDown } from '../../assets/images/arrow-down.svg';
import DataContext from '../../contexts.js';

const weeks = [
  { text: 'Mondays', value: 1 },
  { text: 'Tuesdays', value: 2 },
  { text: 'Wednesdays', value: 3 },
  { text: 'Thursdays', value: 4 },
  { text: 'Fridays', value: 5 },
  { text: 'Saturdays', value: 6 },
  { text: 'Sundays', value: 0 },
];

function WeekdaySelector({ selectedWeekday, setSelectedWeekday }) {
  const dataContext = useContext(DataContext);
  const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);

  const translatedWeeks = useMemo(() => {
    return weeks.map((weekItr) => ({
      text: dataContext?.translations?.[`weekday-${weekItr.value}`],
      value: weekItr.value,
    }));
  }, [dataContext.translations]);

  const onChangeWeekday = useCallback(
    (value) => {
      setSelectedWeekday(value);
      setIsVisibleDropdown(false);
    },
    [setSelectedWeekday, setIsVisibleDropdown],
  );

  return (
    <div className="flex items-center mb-3 relative">
      <h6 className="font-bold text-lg">
        {dataContext?.translations?.['popular-times-title'] || ''}
      </h6>
      <button
        id="weekdayDropdown"
        data-dropdown-toggle="dropdown"
        className="text-lg flex items-center ml-2"
        type="button"
        onClick={() => setIsVisibleDropdown((c) => !c)}
      >
        <p className="min-w-[90px]">
          {
            translatedWeeks.find((weekItr) => weekItr.value === selectedWeekday)
              ?.text
          }
        </p>
        <ArrowDown />
      </button>
      <div
        id="dropdown"
        className={classNames(
          'z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 absolute top-8 left-24',
          isVisibleDropdown ? 'block' : 'hidden',
        )}
      >
        <ul
          className="py-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="weekdayDropdown"
        >
          {translatedWeeks.map((weekItr) => (
            <li key={weekItr.value}>
              <p
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => onChangeWeekday(weekItr.value)}
              >
                {weekItr.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WeekdaySelector;
