const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const specialEventSchema = require('./specialEventSchema');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            specialEventSchema
        }
    })
});

describe('./specialEventSchema.js', () => {    
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                specialEventSchema {
                    description {
                        html
                        raw
                    }
                    id
                    name
                }
            }`,
            rootValue: {
                specialEventSchema: {
                    description: 'description',
                    id: 'event-1',
                    name: 'Event 1'
                }
            }
        }, schema);

        expect(response).to.deep.equal({
            data: {
                specialEventSchema: {
                    description: {
                        html: '<p>description</p>',
                        raw: 'description'
                    },
                    id: 'event-1',
                    name: 'Event 1'
                }
            }
        });
    });
});