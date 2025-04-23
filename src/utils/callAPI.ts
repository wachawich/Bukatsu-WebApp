// utils/apiClient.ts

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
    method: RequestMethod;
    body?: any[];
    from: string;
}

export async function fetchDataApi(method: string, from: string, body: {}): Promise<any> {
    // const urls = process.env.BACKEND_PATH;

    // if (!urls) {
    //     throw new Error('BACKEND_PATH environment variable is not set');
    // }

    try {
        const response = await fetch(`http://localhost:8080/api/${from}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            return data;
        } catch (err) {
            console.error("Server response is not JSON:", text);
            throw new Error(`Invalid JSON: ${text}`);
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

