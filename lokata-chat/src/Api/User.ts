import { jwtDecode } from "jwt-decode";

// Define the shape of the decoded JWT payload
interface DecodedToken {
  exp: number;
  iat: number;
  userId: string;
}

// Function to save token
export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Function to get token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Function to remove token
export const logout = (): void => {
  localStorage.removeItem('token');
};

// Function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.log(error)
    return false; // If decoding fails, assume token is invalid/expired
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && !isTokenExpired(token);
};


export const saveUser = (user) => {
  localStorage.setItem('user', user);
}

export const deleteUser = () => {
  localStorage.removeItem('user');
}

export const  getUser = () => {
  return localStorage.getItem('user');
}


