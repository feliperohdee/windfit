const chai = require('chai');
const Events = require('./Events');

const expect = chai.expect;
const events = new Events();

describe('./Events.js', () => {
    describe('fetch', () => {
        it('should returns with default limit', async () => {
            const response = await events.fetch();

            expect(response.length).to.equal(50);
            expect(response[0]).to.deep.equal({
                description: response[0].description,
                id: 'event-0',
                name: response[0].name,
                partners: response[0].partners,
                special: false
            });
        });
        
        it('should returns with custom limit', async () => {
            const response = await events.fetch({
                limit: 10
            });

            expect(response.length).to.equal(10);
        });
    });
    
    describe('get', () => {
        it('should returns', async () => {
            const response = await events.get({
                id: 'event-0'
            });

            expect(response).to.deep.equal({
                description: response.description,
                id: 'event-0',
                name: response.name,
                partners: response.partners,
                special: false
            });
        });
        
        it('should returns empty', async () => {
            const response = await events.get();

            expect(response).to.deep.equal({
                description: '',
                id: '',
                name: '',
                partners: [],
                special: false
            });
        });
    });
});