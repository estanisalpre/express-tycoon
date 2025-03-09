const API_URL = "http://localhost:5000";

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/players/register`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Usuario ya registrado. Comprueba email u otros datos.");
    }

    return { status: response.status, ...data };
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
}

export async function loginUser(userData) {
  try {
    const response = await fetch(`${API_URL}/players/login`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en el login");
    }

    return data;
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
}

export async function getUserData(email) {
  try {
      const response = await fetch(`${API_URL}/user/${email}`);
      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      throw error;
  }
}