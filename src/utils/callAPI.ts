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

export async function fetchDataApiAI(method: string, from: string, body: {}, route: string = "api"): Promise<any> {
    const urls = "http://127.0.0.1:5000";

    if (!urls) {
        throw new Error('BACKEND_PATH environment variable is not set');
    }

    try {
        const response = await fetch(`${urls}/${from}`, {
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

export async function sendDataApi(method: string, from: string, body: {}): Promise<any> {
    const isFormData = body instanceof FormData;

    try {
        const response = await fetch(`http://localhost:8080/api/${from}`, {
            method,
            headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
            body: method !== 'GET' ? (isFormData ? body : JSON.stringify(body)) : undefined,
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

export async function sendDataApiAI(method: string, from: string, body: FormData): Promise<any> {
    const urls = "http://127.0.0.1:5000";
    const fullUrl = `${urls}/${from}`;

    if (!urls) {
        throw new Error('BACKEND_PATH environment variable is not set');
    }

    console.log('Attempting to fetch from:', fullUrl);
    console.log('Request method:', method);
    console.log('Request body:', body);

    try {
        const response = await fetch(fullUrl, {
            method,
            body: body,
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error('Detailed fetch error:', {
            message: errorMessage,
            stack: errorStack,
            url: fullUrl,
            method: method
        });
        throw new Error(`Failed to fetch: ${errorMessage}`);
    }
}
