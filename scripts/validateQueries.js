const _ = require('lodash');
const graphql = require('graphql');

const constants = require('../constants');
const schema = require('../graphql');

const schemaValidationErrors = graphql.validateSchema(schema);

if (_.size(schemaValidationErrors)) {
    throw schemaValidationErrors;
}

const rules = _.filter(graphql.specifiedRules, rule => {
    return rule.name !== 'OverlappingFieldsCanBeMergedRule';
});

_.forEach(constants.queries, (value, key) => {
    const documentAST = graphql.parse(value);
    const errors = graphql.validate(
        schema,
        documentAST,
        rules
    );

    if (_.size(errors)) {
        throw JSON.stringify({
            key,
            errors
        }, null, 2);
    }
});