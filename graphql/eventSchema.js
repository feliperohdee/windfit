const _ = require('lodash');
const DataLoader = require('dataloader');
const {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');

const partnerSchema = require('./partnerSchema');

const fields = {
    id: {
        type: GraphQLString
    },
    description: {
        type: GraphQLString
    },
    name: {
        type: GraphQLString
    },
    partners: {
        type: new GraphQLList(partnerSchema.type),
        resolve: async (obj, args, context) => {
            const {
                models
            } = context;

            const useDataLoader = true;

            if (!useDataLoader) {
                return await models.partners.batchGet(_.map(obj.partners, 'id'));
            }

            if (!('eventsPartnersLoader' in context)) {
                context.eventsPartnersLoader = new DataLoader(async ids => {
                    return await models.partners.batchGet(ids);
                });
            }

            return await context.eventsPartnersLoader.loadMany(_.map(obj.partners, 'id')); 
        }
    }
};

const type = new GraphQLObjectType({
    name: 'Event',
    fields
});

module.exports = {
    fields,
    type
};