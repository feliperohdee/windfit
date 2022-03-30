const _ = require('lodash');
const hash = require('object-hash');
const jwt = require('promise-jwt');
const url = require('url');

const constants = require('./constants');
const graphqlSchema = require('./graphql');
const libs = require('./libs');
const models = require('./models');

module.exports = class Backend {
    static singleton() {
        if (!Backend._instance) {
            Backend._instance = new Backend();
        }

        return Backend._instance;
    }

    constructor() {
        this.queryCache = {};
        this.models = {
            events: new models.Events(this),
            partners: new models.Partners(this)
        };
    }

    async graphqlContextProvider(args = {}) {
        let auth = {
            role: 'public'
        };

        // const token = await jwt.sign({
        //     role: 'user',
        //     user: 'user-1'
        // }, '12345678', {
        //     expiresIn: '100 years'
        // });

        if (args.token) {
            try {
                auth = await jwt.verify(args.token, '12345678');
            } catch(err) {
                auth = {
                    role: 'public'
                };
            }
        }

        return {
            auth,
            models: this.models
        };
    }

    async graphql(args, schema = graphqlSchema) {
        let {
            contextValue = {},
            operationName = '',
            rootValue = {},
            source = '',
            variableValues = {},
            ...rest
        } = args;

        const hasInnerQuery = _.isString(constants.queries[source]);
        const cacheKey = hasInnerQuery ? `${source}_${rest.hash}` : '';

        // legacy
        if (_.isString(args.query)) {
            source = args.query;
        }

        if (hasInnerQuery) {
            if (this.queryCache[cacheKey]) {
                return this.queryCache[cacheKey];
            }

            source = constants.queries[source];
        }

        contextValue = {
            ...contextValue,
            ...await this.graphqlContextProvider(rest)
        };

        const response = await libs.graphql({
            contextValue,
            operationName,
            rootValue,
            schema,
            source,
            variableValues
        });

        if (
            hasInnerQuery &&
            !('errors' in response)
        ) {
            this.queryCache[cacheKey] = response;
        }

        return response;
    }

    parseRequest(req) {
        if (_.isString(req.body)) {
            try {
                req.body = JSON.parse(req.body);
            } catch (err) {
                req.body = {};
            }
        }

        const {
            pathname,
            search
        } = url.parse(`https://${req.headers['host']}${req.url}`);

        return {
            ...req.body,
            ...req.query,
            gzip: _.includes(req.headers['accept-encoding'], 'gzip'),
            hash: hash({
                body: req.body,
                host: req.headers['host'],
                method: req.method,
                query: req.query,
                url: req.url
            }),
            headers: req.headers,
            host: req.headers['host'],
            path: pathname,
            method: req.method,
            url: req.url,
            queryString: decodeURIComponent(search || ''),
            userAgent: req.headers['user-agent']
        };
    }
};