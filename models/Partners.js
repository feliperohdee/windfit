const _ = require('lodash');
const faker = require('faker');

const dataSource = _.times(100, i => {
    return {
        id: `partner-${i}`,
        name: faker.company.companyName()
    };
});

const emptyResult = {
    id: '',
    name: ''
};

module.exports = class {
    async batchGet(ids = []) {
        // console.log('loading partners', ids);
        
        return Promise.all(_.map(ids, async id => {
            return await this.get({
                id
            });
        }));
    }

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