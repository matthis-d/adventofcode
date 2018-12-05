const { getConvertedLog, getSequences, getSleepingMinutes, findMostSleepingGuard, findSleepiestMinuteForGuard, } = require('../utils');
describe('day 4', () => {
    let entries;
    beforeEach(() => {
        entries = [
            '[1518-11-01 00:00] Guard #10 begins shift',
            '[1518-11-01 00:05] falls asleep',
            '[1518-11-01 00:25] wakes up',
            '[1518-11-01 00:30] falls asleep',
            '[1518-11-01 00:55] wakes up',
            '[1518-11-01 23:58] Guard #99 begins shift',
            '[1518-11-02 00:40] falls asleep',
            '[1518-11-02 00:50] wakes up',
            '[1518-11-03 00:05] Guard #10 begins shift',
            '[1518-11-03 00:24] falls asleep',
            '[1518-11-03 00:29] wakes up',
            '[1518-11-04 00:02] Guard #99 begins shift',
            '[1518-11-04 00:36] falls asleep',
            '[1518-11-04 00:46] wakes up',
            '[1518-11-05 00:03] Guard #99 begins shift',
            '[1518-11-05 00:45] falls asleep',
            '[1518-11-05 00:55] wakes up',
        ];
    });
    test('getConvertedLog', () => {
        expect(getConvertedLog('[1518-11-01 00:00] Guard #10 begins shift')).toEqual({
            year: 1518,
            month: 11,
            day: 1,
            hour: 0,
            minutes: 0,
            message: 'Guard #10 begins shift',
        });
    });
    test('getSequences', () => {
        expect(getSequences(entries)).toEqual([
            {
                id: 10,
                year: 1518,
                month: 11,
                day: 1,
                sleeps: [[5, 25], [30, 55]],
            },
            {
                id: 99,
                year: 1518,
                month: 11,
                day: 2,
                sleeps: [[40, 50]],
            },
            {
                id: 10,
                year: 1518,
                month: 11,
                day: 3,
                sleeps: [[24, 29]],
            },
            {
                id: 99,
                year: 1518,
                month: 11,
                day: 4,
                sleeps: [[36, 46]],
            },
            {
                id: 99,
                year: 1518,
                month: 11,
                day: 5,
                sleeps: [[45, 55]],
            },
        ]);
    });
    test('getSleepingMinutes', () => {
        const sequence = { sleeps: [[5, 25], [30, 55]] };
        expect(getSleepingMinutes(sequence)).toEqual([
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
        ]);
    });
    test('findMostSleepingGuard', () => {
        expect(findMostSleepingGuard(entries)).toEqual({
            id: 10,
            time: 50,
            minute: 24,
        });
    });
    test('findSleepiestMinute', () => {
        expect(findSleepiestMinuteForGuard(entries)).toEqual({
            minute: 45,
            id: 99,
            count: 3,
        });
    });
});
