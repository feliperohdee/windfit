const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const event = require('./isomorphicEvent');

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

describe('./isomorphicEvent.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                event (
                    id: "event-2"
                ) {
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
                        }
                        id
                        name
                    }
                }
            }`
        }, schema);

        expect(response.errors[0].message).to.equal(
            `Fields "description" conflict because they return conflicting types "String" and "SpecialEventDescription". Use different aliases on the fields to fetch both if this was intentional.`
        );
    });
});