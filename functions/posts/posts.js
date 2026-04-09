import { neon } from '@netlify/neon';
const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
const apiKey = process.env.VITE_X_API_KEY
const table = process.env.VITE_TABLE_MARKERS

exports.handler = async (event, context) => {
    const requestKey = event.headers['x-api-key']
    if (apiKey === requestKey) {
        // get the data from the body of the request
        const data = JSON.parse(event.body)
        const Adata = Array.from(Object.entries(data.content), ([key, value]) => value)
        console.log(Adata)
        try {
            // create document in existing collection
            const response = await sql`INSERT INTO ${table} VALUES (${Adata[0]},${Adata[1]},${Adata[2]},${Adata[3][1]},${Adata[4]},${Adata[5]})`
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Successfully created document',
                    data: response
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
};