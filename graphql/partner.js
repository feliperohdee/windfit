const {
    GraphQLString
} = require('graphql');

const partnerSchema = require('./partnerSchema');

const args = {
    id: {
        type: GraphQLString
    }
};

// composition: we're able to extend fields if needed
const type = partnerSchema.type;
const resolve = async (obj, args, context) => {
    const {
        models
    } = context;

    return await models.partners.get(args);
};

module.exports = {
    args,
    resolve,
    type
};