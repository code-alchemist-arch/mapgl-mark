import React, { useContext, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';

import DataContext from '@/contexts';
import { getTranslation } from '@/utils/i18n';
import useMediaQuery from '@/utils/useMediaQuery';

import WeekdaySelector from '../WeekdaySelector';

function PopularTimesChart({ popularTimes }) {
  const dataContext = useContext(DataContext);

  const matchIsMobile = useMediaQuery('(max-width: 428px)');
  const chartWidth = useMemo(
    () => (!matchIsMobile ? 380 : window.screen.width - 48),
    [matchIsMobile],
  );

  const [selectedWeekday, setSelectedWeekday] = useState(new Date().getDay());

  const chartData = useMemo(() => {
    const minHour = 7;
    const maxHour = 19;
    const length = maxHour - minHour + 1;
  
    let data = popularTimes
      ?.filter((dataItr) => dataItr.day === selectedWeekday)
      ?.filter((dataItr) => dataItr.hour >= minHour && dataItr.hour <= maxHour);
  
    // if there are missing hours, fill their occupancies to 0
    const destination = [];
    [...Array(length)].forEach((_, idx) => {
      const hour = minHour + idx;
      let item = {
        occupancy: 0,
        hour,
        day: selectedWeekday,
      };
      if (!data.find((item) => item.hour === hour)) {
        item = data[idx]
      }
      destination.push(item);
    });
  
    return destination;
  }, [popularTimes, selectedWeekday]);

  let maxOccupancy = Math.max(
    ...chartData?.map((dataItr) => dataItr?.occupancy),
  );
  if (maxOccupancy < 100) {
    maxOccupancy = 100;
  }

  return (
    <div className="font-display text-[#595959]">
      <WeekdaySelector
        selectedWeekday={selectedWeekday}
        setSelectedWeekday={setSelectedWeekday}
      />
      <BarChart
        width={chartWidth}
        height={200}
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="hour"
          tickSize={8}
          tickLine={false}
          dy="25"
          style={{
            fontSize: '14px',
            fontFamily: 'Open Sans',
            color: '#595959',
            paddingTop: '10px',
          }}
        />
        <YAxis hide domain={[0, maxOccupancy]} />
        <Bar dataKey="occupancy" barSize={9} radius={10}>
          {chartData?.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={dataContext?.branding?.primaryColor}
            />
          ))}
        </Bar>
      </BarChart>
      <p className="text-sm text-[#595959] font-display mt-6">
        {getTranslation(
          dataContext.translations,
          'popular-times-chart-description',
        )}
      </p>
    </div>
  );
}

export default PopularTimesChart;
