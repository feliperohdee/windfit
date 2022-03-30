const _ = require('lodash');
const faker = require('faker');

const dataSource = _.times(100, i => {
    return {
        description: faker.lorem.lines(2),
        id: `event-${i}`,
        name: faker.company.companyName(),
        partners: _.times(6, i => {
            return {
                id: `partner-${i}`
            };
        }),
        special: Boolean(i % 2)
    };
});

const emptyResult = {
    description: '',
    id: '',
    name: '',
    partners: [],
    special: false
};

module.exports = class {
    async fetch(args = {}) {
        const {
            limit = 50,
            orderBy = [['title'], ['asc']]
        } = args;

        const response = _.orderBy(dataSource, orderBy[0], orderBy[1]);

        return _.take(response, limit);
    }

    async get(args = {}) {
        const {
            id
        } = args;

        return _.find(dataSource, {
            id
        }) || emptyResult;
    }
};