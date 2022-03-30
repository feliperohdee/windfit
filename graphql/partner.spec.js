const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const partner = require('./partner');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            partner
        }
    })
});

describe('./partner.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                partner (
                    id: "partner-1"
                ) {
                    id
                    name
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                partner: {
                    id: 'partner-1',
                    name: response.data.partner.name
                }
            }
        });
    });
    
    it('should works empty', async () => {
        const response = await backend.graphql({
            source: `{
                partner {
                    id
                    name
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                partner: {
                    id: '',
                    name: ''
                }
            }
        });
    });
});