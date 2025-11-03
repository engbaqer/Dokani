export async function apiRequest(
  endpoint,
  { method = "GET", body, token, headers = {}, isFormData = false } = {}
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const finalHeaders = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    };

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
      let errorMessage = `Request failed (${res.status})`;
      try {
        const errorText = await res.text();
        if (errorText) {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
        }
      } catch (e) {
        // If parsing fails, use default error message
      }
      
      alert(`Error: ${errorMessage}`);
      throw new Error(`Request failed (${res.status}): ${errorMessage}`);
    }

    return res.json();
  } catch (error) {
    // Handle network errors or other fetch errors
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      alert("Network Error: Please check your internet connection and try again.");
    } else if (error.message && !error.message.includes("Request failed")) {
      alert(`Error: ${error.message}`);
    }
    
    // Re-throw the error so calling code can handle it if needed
    throw error;
  }
}
