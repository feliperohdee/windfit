const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const events = require('./events');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            events
        }
    })
});

describe('./events.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                events {
                    count
                    data {
                        description
                        id
                        name
                        partners {
                            id
                            name
                        }
                    }
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                events: {
                    count: 50,
                    data: response.data.events.data
                }
            }
        });
    });
    
    it('should works with custom limit and orderBy', async () => {
        const response = await backend.graphql({
            source: `{
                events (
                    limit: 10,
                    orderBy: [["id"], ["desc"]]
                ) {
                    count
                    data {
                        description
                        id
                        name
                        partners {
                            id
                            name
                        }
                    }
                }
            }`
        }, schema);

        expect(response.data.events.data[0].id).to.equal('event-99');
        expect(response).to.deep.equal({
            data: {
                events: {
                    count: 10,
                    data: response.data.events.data
                }
            }
        });
    });
});