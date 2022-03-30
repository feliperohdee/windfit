const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const partnerSchema = require('./partnerSchema');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            partnerSchema
        }
    })
});

describe('./partnerSchema.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                partnerSchema {
                    id
                    name
                }
            }`,
            rootValue: {
                partnerSchema: {
                    id: 'partner-1',
                    name: 'Partner 1'
                }
            }
        }, schema);

        expect(response).to.deep.equal({
            data: {
                partnerSchema: {
                    id: 'partner-1',
                    name: 'Partner 1'
                }
            }
        });
    });
});