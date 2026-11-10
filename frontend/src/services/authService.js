
const API_URL = import.meta.env.VITE_API_URL;

async function authRequest(endpoint, userData) {
    const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
    }

    return data;
}

export function registerUser(userData) {
    return authRequest("register", userData);
}

export function loginUser(userData) {
    return authRequest("login", userData);
}
