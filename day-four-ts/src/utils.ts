import * as fs from 'fs';
import * as readline from 'readline';

interface Countable {
  [key: string]: number;
}

interface Log {
  year: number;
  month: number;
  day: number;
  hour: number;
  minutes: number;
  message: string;
}

type SleepingInterval = [number, number];

interface Sequence {
  id?: number;
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minutes?: number;
  sleeps: SleepingInterval[];
}

interface MinuteStat extends Countable {
  minute: number;
  count: number;
}

interface Guard extends Countable {
  id: number;
  time: number;
  minute: number;
}

interface MinuteSleepedBy {
  [minute: number]: number[];
}

interface GuardMinutesRepartition {
  [minute: number]: number;
}

interface GuardStat {
  id: number;
  count: number;
  minute: number;
}

export const getEntries = (filename: string): Promise<string[]> => {
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

export const sortEntries = (entries: string[]): string[] => [...entries].sort();

export const getConvertedLog = (log: string): Log => {
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

const getGuardRelevance = (convertedLog: Log): string[] =>
  /Guard #(\d+) begins shift/.exec(convertedLog.message);

const isFallingAsleep = (convertedLog: Log): boolean =>
  /falls asleep/.test(convertedLog.message);

const isWakingUp = (convertedLog: Log): boolean =>
  /wakes up/.test(convertedLog.message);

export const getSequences = (entries: string[]): Array<Sequence> => {
  const logs = entries.map(getConvertedLog);
  const result: Array<Sequence> = [];

  let minutesAsleep: number;
  let currentSeq: Sequence;
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

export const getSleepingTime = (sequence: Sequence): number =>
  sequence.sleeps.reduce((sum, sleep) => sum + sleep[1] - sleep[0], 0);

export const isMinuteInInterval = (
  minute: number,
  interval: SleepingInterval
): boolean => interval[0] <= minute && minute < interval[1];

export function getMaxElement<T extends Countable, K extends keyof T>(
  list: Array<T>,
  key: K
): T {
  return list.reduce(
    (maxElement, element) =>
      element[key] > maxElement[key] ? element : maxElement,
    <T>{ [key]: 0 }
  );
}
export const getSleepiestMinute = (
  guardSequencies: Array<Sequence>
): number => {
  const sleepingIntervals: Array<SleepingInterval> = [].concat(
    ...guardSequencies.map(seq => seq.sleeps)
  );

  const stats: Array<MinuteStat> = [];
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

export const findMostSleepingGuard = (entries: string[]): Guard => {
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

export const getSleepingMinutes = (sequence: Sequence): number[] =>
  sequence.sleeps.reduce((acc, sleep) => {
    let result = [...acc];
    for (let minute = sleep[0]; minute < sleep[1]; minute++) {
      result.push(minute);
    }
    return result;
  }, []);

const getGuardStat = (
  guardId: number,
  minutesStats: MinuteSleepedBy
): GuardMinutesRepartition => {
  const stat: GuardMinutesRepartition = {};
  for (let minute = 0; minute < 60; minute++) {
    stat[minute] = (minutesStats[minute] || []).filter(
      id => id === guardId
    ).length;
  }
  return stat;
};

export const getGuardIds = (sequences: Array<Sequence>): number[] =>
  sequences
    .map(seq => seq.id)
    .filter((id, index, array) => array.indexOf(id) === index);

const getMostSleepedMinuteForGuard = (
  stats: GuardMinutesRepartition,
  id: number
): GuardStat =>
  Object.keys(stats).reduce(
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
    { id, count: 0, minute: -1 }
  );

const groupIdsBySleepedMinute = (sequencies: Sequence[]): MinuteSleepedBy =>
  sequencies.reduce((acc, sequence) => {
    const minutes = getSleepingMinutes(sequence);
    for (let minute of minutes) {
      acc = {
        ...acc,
        [minute]: [...(acc[minute] || []), sequence.id],
      };
    }
    return acc;
  }, {});

export const findSleepiestMinuteForGuard = (entries: string[]): GuardStat => {
  const sequencies = getSequences(entries);
  const minutesStats = groupIdsBySleepedMinute(sequencies);

  return getGuardIds(sequencies).reduce(
    (acc, id) => {
      const stats = getGuardStat(id, minutesStats);
      const mostSleepedMinute = getMostSleepedMinuteForGuard(stats, id);
      if (mostSleepedMinute.count > acc.count) {
        return mostSleepedMinute;
      }
      return acc;
    },
    { id: 0, count: 0, minute: -1 }
  );
};
