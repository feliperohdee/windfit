const {
    GraphQLString,
    GraphQLUnionType
} = require('graphql');

const eventSchema = require('./eventSchema');
const specialEventSchema = require('./specialEventSchema');

const args = {
    id: {
        type: GraphQLString
    }
};

const type = new GraphQLUnionType({
    name: 'IsomorphicEvent',
    types: [
        eventSchema.type,
        specialEventSchema.type
    ],
    resolveType: payload => {
        if (payload.special) {
            return 'SpecialEvent';
        }

        return 'Event';
    }
});

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