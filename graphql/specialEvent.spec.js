const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const specialEvent = require('./specialEvent');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            specialEvent
        }
    })
});

describe('./specialEvent.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                specialEvent (
                    id: "event-1"
                ) {
                    description {
                        html
                        raw
                        short (
                            length: 50
                        )
                    }
                    id
                    name
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                specialEvent: {
                    description: {
                        html: response.data.specialEvent.description.html,
                        raw: response.data.specialEvent.description.raw,
                        short: response.data.specialEvent.description.short
                    },
                    id: 'event-1',
                    name: response.data.specialEvent.name
                }
            }
        });
    });
});