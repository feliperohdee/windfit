const _ = require('lodash');
const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType
} = require('graphql');

const partnerSchema = require('./partnerSchema');
const jsonSchema = require('./jsonSchema');

const args = {
    limit: {
        type: GraphQLInt
    },
    orderBy: {
        type: jsonSchema.type
    }
};

const fields = {
    count: {
        type: GraphQLInt
    },
    data: {
        type: new GraphQLList(partnerSchema.type)
    }
};

const type = new GraphQLObjectType({
    name: 'Partners',
    fields
});

const resolve = async (obj, args, context) => {
    const {
        models
    } = context;

    const response = await models.partners.fetch(args);

    return {
        count: _.size(response),
        data: response
    };
};

module.exports = {
    args,
    fields,
    resolve,
    type
};