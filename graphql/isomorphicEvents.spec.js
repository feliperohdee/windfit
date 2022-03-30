const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const isomorphicEvents = require('./isomorphicEvents');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            isomorphicEvents
        }
    })
});

describe.skip('./isomorphicEvents.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                isomorphicEvents {
                    count
                    data {
                        ...on Event {
                            description
                            id
                            name
                            partners {
                                id
                                name
                            }
                        }
                        ...on SpecialEvent {
                            description {
                                html
                                raw
                                short
                            }
                            id
                            name
                            partners {
                                id
                                name
                            }
                        }
                    }
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                isomorphicEvents: {
                    count: 50,
                    data: response.data.isomorphicEvents.data
                }
            }
        });
    });
    
    it('should works with custom limit and orderBy', async () => {
        const response = await backend.graphql({
            source: `{
                isomorphicEvents (
                    limit: 10,
                    orderBy: ID_DESC
                ) {
                    count
                    data {
                        ...on Event {
                            description
                            id
                            name
                            partners {
                                id
                                name
                            }
                        }
                        ...on SpecialEvent {
                            description {
                                html
                                raw
                                short
                            }
                            id
                            name
                            partners {
                                id
                                name
                            }
                        }
                    }
                }
            }`
        }, schema);

        expect(response.data.isomorphicEvents.data[0].id).to.equal('event-99');
        expect(response).to.deep.equal({
            data: {
                isomorphicEvents: {
                    count: 10,
                    data: response.data.isomorphicEvents.data
                }
            }
        });
    });
});