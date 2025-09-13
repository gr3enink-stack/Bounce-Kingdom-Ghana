// Authentication service for handling login/logout

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('isAdminLoggedIn') === 'true';
};

// Login function
export const login = async (username, password) => {
  // In a real application, this would make an API call to authenticate the user
  // For now, we'll simulate authentication with the default admin user
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('isAdminLoggedIn', 'true');
    return { success: true, user: { username: 'admin', role: 'admin' } };
  }
  
  // For a real implementation with MongoDB, you would do something like this:
  /*
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'An error occurred during login' };
  }
  */
  
  return { success: false, error: 'Invalid username or password' };
};

// Logout function
export const logout = () => {
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};