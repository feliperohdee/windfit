const {
    GraphQLString
} = require('graphql');

const eventSchema = require('./eventSchema');

const args = {
    id: {
        type: GraphQLString
    }
};

// composition: we're able to extend fields if needed
const type = eventSchema.type;
const resolve = async (obj, args, context) => {
    const {
        models
    } = context;

    return await models.events.get(args);
};

module.exports = {
    args,
    resolve,
    type
};