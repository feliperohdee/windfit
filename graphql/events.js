const _ = require('lodash');
const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType
} = require('graphql');

const eventSchema = require('./eventSchema');
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
        type: new GraphQLList(eventSchema.type)
    }
};

const type = new GraphQLObjectType({
    name: 'Events',
    fields
});

const resolve = async (obj, args, context) => {
    const {
        models
    } = context;

    const response = await models.events.fetch(args);

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