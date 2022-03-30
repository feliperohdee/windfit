const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const eventSchema = require('./eventSchema');

chai.use(sinonChai);

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            eventSchema
        }
    })
});

describe('./eventSchema.js', () => {
    beforeEach(() => {
        sinon.spy(backend.models.partners, 'batchGet');
    });
    
    afterEach(() => {
        backend.models.partners.batchGet.restore();
    });
    
    it('should works and multiplex partner loading', async () => {
        const response = await backend.graphql({
            source: `{
                eventSchema {
                    description
                    id
                    name
                    partners {
                        id
                        name
                    }
                }
            }`,
            rootValue: {
                eventSchema: {
                    description: 'description',
                    id: 'event-1',
                    name: 'Event 1',
                    partners: [{
                        id: 'partner-1'
                    }, {
                        id: 'partner-1'
                    }, {
                        id: 'partner-2'
                    }]
                }
            }
        }, schema);

        expect(backend.models.partners.batchGet).to.have.been.calledOnceWithExactly([
            'partner-1',
            'partner-2'
        ]);

        expect(response).to.deep.equal({
            data: {
                eventSchema: {
                    description: 'description',
                    id: 'event-1',
                    name: 'Event 1',
                    partners: [{
                        id: 'partner-1',
                        name: response.data.eventSchema.partners[0].name
                    }, {
                        id: 'partner-1',
                        name: response.data.eventSchema.partners[1].name
                    }, {
                        id: 'partner-2',
                        name: response.data.eventSchema.partners[2].name
                    }]
                }
            }
        });
    });
});