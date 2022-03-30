const _ = require('lodash');
const {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');

const eventSchema = require('./eventSchema');

const fields = {
    ...eventSchema.fields,
    description: {
        type: new GraphQLObjectType({
            name: 'SpecialEventDescription',
            fields: {
                html: {
                    type: GraphQLString
                },
                raw: {
                    type: GraphQLString
                },
                short: {
                    args: {
                        length: {
                            type: GraphQLInt
                        }
                    },
                    type: GraphQLString,
                    resolve: (obj, args) => {
                        return _.truncate(obj.raw, {
                            length: args.shortLength || 30,
                            omission: '...',
                            separator: ' '
                        });
                    }
                }
            }
        }),
        resolve: obj => {
            return {
                html: `<p>${obj.description}</p>`,
                raw: obj.description
            };
        }
    }
};

const type = new GraphQLObjectType({
    name: 'SpecialEvent',
    fields
});

module.exports = {
    fields,
    type
};