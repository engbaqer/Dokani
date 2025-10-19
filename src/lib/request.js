export async function apiRequest(endpoint, { method = "GET", body, token, headers = {}, isFormData = false } = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

    // Prepare headers
    const finalHeaders = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
    };

    // Only add Content-Type if NOT sending FormData
    if (!isFormData) {
        finalHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: finalHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed (${res.status}): ${errorText}`);
    }

    return res.json();
}
