const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const event = require('./event');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            event
        }
    })
});

describe('./event.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                event (
                    id: "event-1"
                ) {
                    description
                    id
                    name
                    partners {
                        id
                        name
                    }
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                event: {
                    description: response.data.event.description,
                    id: 'event-1',
                    name: response.data.event.name,
                    partners: response.data.event.partners
                }
            }
        });
    });
    
    it('should works empty', async () => {
        const response = await backend.graphql({
            source: `{
                event {
                    description
                    id
                    name
                    partners {
                        id
                        name
                    }
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                event: {
                    description: '',
                    id: '',
                    name: '',
                    partners: []
                }
            }
        });
    });
});