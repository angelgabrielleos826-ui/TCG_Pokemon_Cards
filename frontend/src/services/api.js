async function request(path, options = {}) {
      const res = await fetch(`https://tcg-pokemon-cards.onrender.com${path}`, {
        ...options,
        headers : {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include"
    });

    let data = null 
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await res.json().catch(() => null)
    }

    if (!res.ok) {
        const msg = data?.error || `HTTP ${res.status}`;
        const err = new Error(msg)
        err.status = res.status;
        err.data = data;
        throw err
    }

    return data;
};

export const api = {
    get: (path) => request(path, {method: "GET"}),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body)}),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body)}),
    delete: (path) => request(path, {method: "DELETE"})
}
