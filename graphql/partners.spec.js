const chai = require('chai');
const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const Backend = require('../Backend');
const partners = require('./partners');

const expect = chai.expect;
const backend = new Backend();
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            partners
        }
    })
});

describe('./partners.js', () => {
    it('should works', async () => {
        const response = await backend.graphql({
            source: `{
                partners {
                    count
                    data {
                        id
                        name
                    }
                }
            }`
        }, schema);

        expect(response).to.deep.equal({
            data: {
                partners: {
                    count: 50,
                    data: response.data.partners.data
                }
            }
        });
    });
    
    it('should works with custom limit and orderBy', async () => {
        const response = await backend.graphql({
            source: `{
                partners (
                    limit: 10,
                    orderBy: [["id"], ["desc"]]
                ) {
                    count
                    data {
                        id
                        name
                    }
                }
            }`
        }, schema);

        expect(response.data.partners.data[0].id).to.equal('partner-99');
        expect(response).to.deep.equal({
            data: {
                partners: {
                    count: 10,
                    data: response.data.partners.data
                }
            }
        });
    });
});