/*import { neon } from '@netlify/neon'
// initialize faunaDB client with our secret
const client = new faunadb.Client({
    secret: process.env.FAUNADB_ADMIN_SECRET,
    domain: 'db.fauna.com',
    scheme: 'https'
});
const apiKey = process.env.VITE_X_API_KEY
const collection = process.env.VITE_TABLE_MARKERS
// the query object provides us with functions to create a new document in the collection
//const q = faunadb.query;

const sql = neon()

exports.handler = async (event, context) => {
    const requestKey = event.headers['x-api-key']
    if (apiKey === requestKey) {
        try {
            const res = await client.query(
                // map through each document returned by paginate
                q.Map(
                    // get documents from collection
                    q.Paginate(
                        q.Documents(
                            q.Collection(collection)
                        )
                    ),
                    // get content of each document
                    q.Lambda('doc', q.Get(q.Var('doc')))
                )
            );
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Successfully fetched documents',
                    data: res.data
                })
            };
                    } catch (error) {
            console.log(error);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error
                })
            };
        }
    } else {
        return {
            statusCode: 500,
            body: 'DENIED'
        }
    }
}*/