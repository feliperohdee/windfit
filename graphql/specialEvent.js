const {
    GraphQLString
} = require('graphql');

const specialEventSchema = require('./specialEventSchema');

const args = {
    id: {
        type: GraphQLString
    }
};

const type = specialEventSchema.type;
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