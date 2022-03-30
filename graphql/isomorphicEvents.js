const _ = require('lodash');
const {
    GraphQLEnumType,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLUnionType
} = require('graphql');

const eventSchema = require('./eventSchema');
const isomorphicEvent = require('./isomorphicEvent');
const jsonSchema = require('./jsonSchema');

const EventsOrderBy = new GraphQLEnumType({
    name: 'EventsOrderBy',
    values: {
        ID_ASC: {
            value: [['id'], ['asc']]
        },
        ID_DESC: {
            value: [['id'], ['desc']]
        },
        SPECIAL_ASC: {
            value: [['special'], ['asc']]
        },
        SPECIAL_DESC: {
            value: [['special'], ['desc']]
        },
        TITLE_ASC: {
            value: [['title'], ['asc']]
        },
        TITLE_DESC: {
            value: [['title'], ['desc']]
        }
    }
});

const args = {
    limit: {
        type: GraphQLInt
    },
    orderBy: {
        type: EventsOrderBy
    }
};

const fields = {
    count: {
        type: GraphQLInt
    },
    data: {
        type: new GraphQLList(isomorphicEvent.type)
    }
};

const type = new GraphQLObjectType({
    name: 'IsomorphicEvents',
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