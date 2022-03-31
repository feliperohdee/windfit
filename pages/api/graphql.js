import Cors from 'micro-cors';
import Backend from '../../Backend';

const backend = new Backend();

const cors = Cors({
    allowMethods: ['GET','POST', 'HEAD']
});

export default cors(async (req, res) => {
    req = backend.parseRequest(req);

    if (req.method === 'OPTIONS') {
        return res.status(200)
            .end('');
    }

    if (req.method === 'POST') {
        const response = await backend.graphql(req);

        res.status(200)
            .json(response);

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405)
            .end('Method Not Allowed');
    }
});