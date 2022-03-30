const {
    GraphQLObjectType,
    GraphQLString
} = require('graphql');

const fields = {
    id: {
        type: GraphQLString
    },
    name: {
        type: GraphQLString
    }
};

const type = new GraphQLObjectType({
    name: 'PartnerSchema',
    fields
});

module.exports = {
    fields,
    type
};