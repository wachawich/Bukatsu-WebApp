// utils/apiClient.ts

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
    method: RequestMethod;
    body?: any[];
    from: string;
    route? : string;
}

export async function fetchDataApi(method: string, from: string, body: {}, route: string = "api"): Promise<any> {
    const urls = process.env.BACKEND_PATH || "http://localhost:8080";

    if (!urls) {
        throw new Error('BACKEND_PATH environment variable is not set');
    }

    try {
        console.log(`console.log(${urls}/${route}/${from})`, `${urls}/${route}/${from}`);

        const response = await fetch(`${urls}/${route}/${from}`, {
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

