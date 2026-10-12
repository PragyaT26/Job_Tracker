// One small helper used for every call to the backend.
// It adds the login token automatically.
const API = import.meta.env.VITE_API_URL;

export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    // server is down or no internet
    throw new Error("Cannot reach the server. Please try again.");
  }

  let data = {};
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status; // 401 = not logged in / token expired
    throw err;
  }
  return data;
}
