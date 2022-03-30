const graphql = require('graphql');

const _ = require('lodash');

const {
    parse,
    validate,
    validateSchema,
    execute,
    specifiedRules
} = graphql;

const parseMemoized = _.memoize(source => {
    return parse(source);
});

const AVOID_CONFLICT = false;

module.exports = async (args = {}) => {
    let {
        schema,
        source
    } = args;

    // no need to validate schema each time in production, it is validated in tests
    if (process.env.NODE_ENV !== 'production') {
        const schemaValidationErrors = validateSchema(schema);

        if (_.size(schemaValidationErrors)) {
            return {
                errors: schemaValidationErrors
            };
        }
    }

    const documentAST = parseMemoized(source);

    if (process.env.NODE_ENV !== 'production') {
        // enable fields with same name and different types on union types
        // const rules = specifiedRules;
        const rules = _.filter(specifiedRules, rule => {
            // console.log({
            //     rule: rule.name
            // });
            
            if (AVOID_CONFLICT) {
                return rule.name !== 'OverlappingFieldsCanBeMergedRule';
            }

            return true;
        });
    
        const errors = validate(
            schema,
            documentAST,
            rules
        );
    
        if (_.size(errors)) {
            return {
                errors
            };
        }
    }

    return await execute({
        schema,
        document: documentAST,
        rootValue: args.rootValue || {},
        contextValue: args.contextValue || {},
        variableValues: args.variableValues || {},
        operationName: args.operationName || null
    });
};