const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const libs = require('./libs');
const Backend = require('./Backend');

chai.use(sinonChai);

const expect = chai.expect;
const backend = new Backend();

describe('./Backend.js', () => {
    describe('contructor', () => {
        it('should have properties', async () => {
            expect(backend).to.have.all.keys([
                'models',
                'queryCache'
            ]);
        });
    });
    
    describe('graphqlContextProvider', () => {
        it('should returns context with public auth', async () => {
            expect(await backend.graphqlContextProvider()).to.deep.equal({
                auth: {
                    role: 'public'
                },
                models: backend.models
            });
        });
        
        it('should returns context with auth', async () => {
            expect(await backend.graphqlContextProvider({
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInVzZXIiOiJ1c2VyLTEiLCJpYXQiOjE2NDg2NDczNTksImV4cCI6NDgwNDQwNzM1OX0.ge61jHeO6Pr5BclcRKwYGXe7vTfXid6wPiTeTihxBss'
            })).to.deep.equal({
                auth: {
                    exp: 4804407359,
                    iat: 1648647359,
                    role: 'user',
                    user: 'user-1'
                },
                models: backend.models
            });
        });
    });
    
    describe('graphql', () => {
        beforeEach(() => {
            sinon.spy(libs, 'graphql');
        });
        
        afterEach(() => {
            libs.graphql.restore();
        });

        it('should returns', async () => {
            const response = await backend.graphql({
                source: `query (
                    $id: String
                ){
                    event (
                        id: $id
                    ) {
                        id
                    }
                }`,
                variableValues: {
                    id: 'event-1'
                }
            });

            expect(response.data).to.deep.equal({
                event: {
                    id: 'event-1'
                }
            });
        });
        
        it('should returns with inner query', async () => {
            const response = await backend.graphql({
                hash: 'request-hash',
                source: 'event',
                variableValues: {
                    id: 'event-1'
                }
            });

            expect(libs.graphql).to.have.been.calledOnce;
            expect(backend.queryCache).to.have.all.keys([
                'event_request-hash'
            ]);

            expect(response.data).to.deep.equal({
                event: {
                    description: response.data.event.description,
                    id: 'event-1',
                    name: response.data.event.name,
                    partners: response.data.event.partners
                }
            });
        });
        
        it('should returns with cache', async () => {
            const response = await backend.graphql({
                hash: 'request-hash',
                source: 'event',
                variableValues: {
                    id: 'event-1'
                }
            });
            
            expect(libs.graphql).to.not.have.been.called;
            expect(response.data).to.deep.equal({
                event: {
                    description: response.data.event.description,
                    id: 'event-1',
                    name: response.data.event.name,
                    partners: response.data.event.partners
                }
            });
        });
    });

    describe('parseRequest', () => {
        it('should works', () => {
            expect(backend.parseRequest({
                headers: {
                    'host': 'spec.windfit.com',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
                },
                method: 'GET',
                url: '/'
            })).to.deep.equal({
                gzip: false,
                hash: '36e4cb8dc2b0ff8be5a4087cf36b9c2f7c12841d',
                host: 'spec.windfit.com',
                headers: {
                    'host': 'spec.windfit.com',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
                },
                method: 'GET',
                path: '/',
                queryString: '',
                url: '/',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
            });
        });

        it('should parse body', () => {
            expect(backend.parseRequest({
                body: JSON.stringify({
                    a: 1
                }),
                headers: {
                    'host': 'spec.windfit.com',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
                },
                method: 'GET',
                url: '/'
            })).to.deep.equal({
                a: 1,
                gzip: false,
                hash: '07189bf9d4768455a63079d865dd73b1038b5e2e',
                host: 'spec.windfit.com',
                headers: {
                    'host': 'spec.windfit.com',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
                },
                method: 'GET',
                path: '/',
                queryString: '',
                url: '/',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
            });
        });

        it('should accepts gzip', () => {
            expect(backend.parseRequest({
                headers: {
                    'accept-encoding': 'br, gzip',
                    'host': 'spec.windfit.com',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
                },
                method: 'GET',
                url: '/'
            })).to.deep.equal({
                gzip: true,
                hash: '36e4cb8dc2b0ff8be5a4087cf36b9c2f7c12841d',
                host: 'spec.windfit.com',
                headers: {
                    'accept-encoding': 'br, gzip',
                    'host': 'spec.windfit.com',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
                },
                method: 'GET',
                path: '/',
                queryString: '',
                url: '/',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
            });
        });
    });
});