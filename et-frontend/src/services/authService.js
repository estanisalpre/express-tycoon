const API_URL = "http://localhost:5000";

export async function registerUser(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }

export async function loginUser(userData) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
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
