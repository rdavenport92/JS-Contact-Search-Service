import { expect } from 'chai';
import { formatPhoneNumber } from '../../../contactService/contactHelper';

describe('Contact Helper', () => {
    describe('formatPhoneNumber', () => {
        interface IFormatTestScenario {
            toConvert: string;
            expected?: string;
            scenario: string;
        }

        const positiveTestScenarios: IFormatTestScenario[] = [
            {
                toConvert: '5558375647',
                expected: '(555) 837-5647',
                scenario: '10 digit string',
            },
            {
                toConvert: '15558875637',
                expected: '(555) 887-5637',
                scenario: '11 digit string',
            },
            {
                toConvert: '+18885746574',
                expected: '(888) 574-6574',
                scenario: '11 digit string with country code format',
            },
            {
                toConvert: '345-234-1234',
                expected: '(345) 234-1234',
                scenario: 'string of 10 digits with dashes',
            },
            {
                toConvert: '+1-345-234-1234',
                expected: '(345) 234-1234',
                scenario:
                    'string of 11 digits with dashes and country code format',
            },
            {
                toConvert: '+189f74s6gf3jd75ku8-jkl4',
                expected: '(897) 463-7584',
                scenario:
                    'string of 11 digits with country code format mixed with random chars',
            },
        ];

        positiveTestScenarios.forEach(({ toConvert, expected, scenario }) => {
            it(`should convert phone number to valid format from ${scenario}`, () => {
                const result = formatPhoneNumber(toConvert);

                expect(result).to.equal(expected);
            });
        });

        const negativeTestScenarios: IFormatTestScenario[] = [
            { toConvert: '123456789', scenario: 'less than 10 digits' },
            { toConvert: '1234345656787', scenario: 'greater than 11 digits' },
            {
                toConvert: '123-456-789',
                scenario: 'less than 10 digits with dashes',
            },
            {
                toConvert: '+123-434-565-6787',
                scenario:
                    'greater than 11 digits with dashes and country code format',
            },
            {
                toConvert: '1gd23d-4asdf56-s78e9eee',
                scenario:
                    'less than 10 digits with dashes and random chars mixed in',
            },
        ];

        negativeTestScenarios.forEach(({ toConvert, scenario }) => {
            it(`should return null if ${scenario}`, () => {
                const result = formatPhoneNumber(toConvert);

                expect(result).to.be.null;
            });
        });
    });
});
