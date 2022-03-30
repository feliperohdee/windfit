const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

const event = require('./event');
const events = require('./events');
const isomorphicEvent = require('./isomorphicEvent');
const partner = require('./partner');
const partners = require('./partners');
const specialEvent = require('./specialEvent');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            event,
            events,
            isomorphicEvent,
            partner,
            partners,
            specialEvent
        }
    })
    // mutation: new GraphQLObjectType({
    //     name: 'Mutation',
    //     fields: fields(mutation)
    // }),
    // subscription: new withDefaults.GraphQLObjectType({
    //     name: 'Subscription',
    //     fields: fields(subscription)
    // })
});