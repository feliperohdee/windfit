const chai = require('chai');
const Partners = require('./Partners');

const expect = chai.expect;
const partners = new Partners();

describe('./Partners.js', () => {
    describe('batchGet', () => {
        it('should returns empty', async () => {
            const response = await partners.batchGet([]);

            expect(response.length).to.equal(0);
        });

        it('should returns', async () => {
            const response = await partners.batchGet([
                'partner-1',
                'partner-2'
            ]);

            expect(response.length).to.equal(2);
        });
    });
    
    describe('fetch', () => {
        it('should returns with default limit', async () => {
            const response = await partners.fetch();

            expect(response.length).to.equal(50);
            expect(response[0]).to.deep.equal({
                id: 'partner-0',
                name: response[0].name
            });
        });

        it('should returns with custom limit', async () => {
            const response = await partners.fetch({
                limit: 10
            });

            expect(response.length).to.equal(10);
        });
    });

    describe('get', () => {
        it('should returns', async () => {
            const response = await partners.get({
                id: 'partner-0'
            });

            expect(response).to.deep.equal({
                id: 'partner-0',
                name: response.name
            });
        });

        it('should returns empty', async () => {
            const response = await partners.get();

            expect(response).to.deep.equal({
                id: '',
                name: ''
            });
        });
    });
});