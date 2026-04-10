import { neon } from '@netlify/neon';
const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
const apiKey = process.env.VITE_X_API_KEY

exports.handler = async (event, context) => {
    const requestKey = event.headers['x-api-key']
    if (apiKey === requestKey) {
        try {
            const res = await sql`SELECT * FROM logs_f4fp2sk9h45`
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Successfully fetched documents',
                    data: res
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
}