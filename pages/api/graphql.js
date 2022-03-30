import Backend from '../../Backend';

const backend = new Backend();

export default async (req, res) => {
    req = backend.parseRequest(req);

    if (1 || req.method === 'POST') {
        const response = await backend.graphql(req);

        res.status(200)
            .json(response);

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405)
            .end('Method Not Allowed');
    }
};