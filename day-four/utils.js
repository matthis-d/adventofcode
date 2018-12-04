const fs = require('fs');
const readline = require('readline');

const getEntries = filename => {
  return new Promise((resolve, reject) => {
    const entries = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });

    rl.on('line', line => {
      entries.push(line);
    });

    rl.on('close', () => {
      resolve(entries);
    });

    rl.on('error', reject);
  });
};

const sortEntries = entries => [...entries].sort();

const getConvertedLog = log => {
  const regex = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.+)/;
  const matches = regex.exec(log);
  return {
    year: parseInt(matches[1], 10),
    month: parseInt(matches[2], 10),
    day: parseInt(matches[3], 10),
    hour: parseInt(matches[4], 10),
    minutes: parseInt(matches[5], 10),
    message: matches[6],
  };
};

const getGuardRelevance = convertedLog =>
  /Guard #(\d+) begins shift/.exec(convertedLog.message);

const isFallingAsleep = convertedLog =>
  /falls asleep/.test(convertedLog.message);

const isWakingUp = convertedLog => /wakes up/.test(convertedLog.message);

const getSequences = entries => {
  const logs = entries.map(getConvertedLog);
  const result = [];

  let minutesAsleep;
  let currentSeq;
  for (const log of logs) {
    const guardMatches = getGuardRelevance(log);
    if (guardMatches && guardMatches.length > 1) {
      currentSeq = { sleeps: [] };
      currentSeq.id = parseInt(guardMatches[1], 10);
      result.push(currentSeq);
    }

    if (isFallingAsleep(log)) {
      currentSeq.year = log.year;
      currentSeq.month = log.month;
      currentSeq.day = log.day;

      minutesAsleep = log.minutes;
    }

    if (isWakingUp(log)) {
      currentSeq.sleeps.push([minutesAsleep, log.minutes]);
    }
  }

  return result;
};

const getSleepingTime = sequence =>
  sequence.sleeps.reduce((sum, sleep) => sum + sleep[1] - sleep[0], 0);

const isMinuteInInterval = (minute, interval) =>
  interval[0] <= minute && minute < interval[1];

const getMaxElement = (list, key) =>
  list.reduce(
    (maxElement, element) =>
      element[key] > maxElement[key] ? element : maxElement,
    { [key]: 0 }
  );

const getSleepiestMinute = guardSequencies => {
  const sleepingIntervals = [].concat(
    ...guardSequencies.map(seq => seq.sleeps)
  );

  const stats = [];
  for (let minute = 0; minute < 60; minute++) {
    const count = sleepingIntervals.reduce(
      (count, interval) =>
        isMinuteInInterval(minute, interval) ? count + 1 : count,
      0
    );
    stats.push({
      minute,
      count,
    });
  }

  return getMaxElement(stats, 'count').minute;
};

const findMostSleepingGuard = entries => {
  const sequences = getSequences(entries);
  const guardIds = sequences
    .map(seq => seq.id)
    .filter((id, index, array) => array.indexOf(id) === index);

  const stats = guardIds.map(id => {
    const guardSequencies = sequences.filter(seq => seq.id === id);
    return {
      id,
      time: guardSequencies.reduce((sum, seq) => sum + getSleepingTime(seq), 0),
      minute: getSleepiestMinute(guardSequencies),
    };
  });

  return getMaxElement(stats, 'time');
};

const getSleepingMinutes = sequence =>
  sequence.sleeps.reduce((acc, sleep) => {
    let result = [...acc];
    for (let minute = sleep[0]; minute < sleep[1]; minute++) {
      result.push(minute);
    }
    return result;
  }, []);

const getGuardStat = (guardId, minutesStats) => {
  const stat = {};
  for (let minute = 0; minute < 60; minute++) {
    stat[minute] = (minutesStats[minute] || []).filter(
      id => id === guardId
    ).length;
  }
  return stat;
};

const getGuardIds = sequences =>
  sequences
    .map(seq => seq.id)
    .filter((id, index, array) => array.indexOf(id) === index);

const findSleepiestMinuteForGuard = entries => {
  const sequencies = getSequences(entries);
  const minutesStats = sequencies.reduce((acc, sequence) => {
    const minutes = getSleepingMinutes(sequence);
    for (let minute of minutes) {
      acc = {
        ...acc,
        [minute]: [...(acc[minute] || []), sequence.id],
      };
    }
    return acc;
  }, {});

  return getGuardIds(sequencies).reduce(
    (acc, id) => {
      const stats = getGuardStat(id, minutesStats);
      const mostSleepedMinute = Object.keys(stats).reduce(
        (result, minute) => {
          if (stats[minute] > result.count) {
            return {
              count: stats[minute],
              id,
              minute: parseInt(minute),
            };
          }
          return result;
        },
        { count: 0 }
      );
      if (mostSleepedMinute.count > acc.count) {
        return mostSleepedMinute;
      }
      return acc;
    },
    { count: 0 }
  );
};

module.exports = {
  getEntries,
  sortEntries,
  getConvertedLog,
  getSequences,
  getSleepingMinutes,
  findMostSleepingGuard,
  findSleepiestMinuteForGuard,
};
