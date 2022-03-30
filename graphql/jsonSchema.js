const _ = require('lodash');
const {
    GraphQLScalarType
} = require('graphql');
const {
    Kind
} = require('graphql/language');

function parseLiteral(ast) {
    switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
            return parseFloat(ast.value);
        case Kind.OBJECT: {
                const value = {};

                ast.fields.forEach((field) => {
                    value[field.name.value] = parseLiteral(field.value);
                });

                return value;
            }
        case Kind.LIST:
            return ast.values.map(parseLiteral);
        default:
            return null;
    }
}

const identity = value => {
    if(!_.isObjectLike(value)) {
        return {};
    }
    
    return value;
};

const type = new GraphQLScalarType({
    name: 'Json',
    description: 'The `Json` scalar type represents JSON values as specified by ' +
        '[ECMA-404](http://www.ecma-international.org/' +
        'publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: identity,
    parseValue: identity,
    parseLiteral
});

module.exports = {
    type
};
