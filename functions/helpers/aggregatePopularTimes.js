const dayjs = require('dayjs');
const axios = require('axios');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();

// function to fetch post endpoint with axios
async function fetchTimeSeriesAggregation({
  akenzaApiUrl,
  akenzaApiKey,
  assetId,
}) {
  const startDate = dayjs().startOf('week').toISOString();
  const endDate = dayjs().subtract('4', 'weeks').startOf('week').toISOString();

  const aggregationResp = await axios({
    method: 'post',
    url: `${akenzaApiUrl}/v3/devices/${assetId}/query/time-series/aggregation`,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': akenzaApiKey,
    },
    data: {
      data: {
        key: 'percent',
        topic: 'peopleIn',
      },
      timestamp: {
        from: endDate,
        to: startDate,
      },
      bucket: {
        interval: 'PT1H',
        aggregation: 'AVG',
      },
    },
  });
  return aggregationResp.data.data;
}

async function aggregatePopularTimes(location, disableUpdate) {
  const { assetId } = location;
  try {
    if (!assetId || assetId === '') {
      throw new Error('assetId is not defined');
    }

    const data = await fetchTimeSeriesAggregation(location);

    const dayHourMap = {};
    data.timestamps.forEach((timestampItr, timestampIdx) => {
      const occupancyData = data?.dataPoints?.[timestampIdx] || null;
      if (occupancyData === undefined || occupancyData === null) {
        return;
      }

      const date = dayjs(timestampItr);
      if (!dayHourMap[date.day()]) {
        const dayTemplate = {};
        Array(24)
          .fill(0)
          .forEach((_, hourItr) => (dayTemplate[hourItr] = []));
        dayHourMap[date.day()] = dayTemplate;
      }

      dayHourMap[date.day()][date.hour()].push(
        data?.dataPoints?.[timestampIdx],
      );
    });

    const chartData = [];

    Object.keys(dayHourMap).forEach((dayItr) => {
      const dayData = dayHourMap[dayItr];
      Object.keys(dayData).forEach((hourItr) => {
        const hourData = dayData[hourItr] || [];
        const avgOccupancy =
          hourData.reduce((a, b) => a + b, 0) / hourData.length;

        chartData.push({
          day: parseInt(dayItr, 10),
          hour: parseInt(hourItr, 10),
          occupancy: avgOccupancy || 0,
        });
      });
    });

    if (disableUpdate) {
      return chartData;
    }

    await db.collection('locations').doc(location.id).update({
      popularTimes: chartData,
      updatedAt: new Date(),
      popularTimesUpdatedAt: new Date(),
    });
    return true;
  } catch (err) {
    console.log(
      'Error in aggregatePopularTimes',
      location?.assetId,
      location?.title,
      err,
    );
    return false;
  }
}

module.exports = aggregatePopularTimes;
