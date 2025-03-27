// import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Create and export the context itself
// export const UserContext = createContext();

// // The provider component
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check for existing token on initial load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       try {
//         // Verify token is still valid
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         logout();
//       }
//     }
//     setIsLoading(false);
//   }, []);
// // In your UserContext.js
// const login = async (formData, redirectPath = '/') => {
//   try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(formData)
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//           throw new Error(data.message || 'Login failed');
//       }
      
//       // Store token and user data
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
      
//       // Update context
//       setUser(data.user);
//       navigate(redirectPath);
      
//       return { success: true, user: data.user };
//   } catch (error) {
//       return { success: false, error: error.message };
//   }
// };

//   const register = async (formData, redirectPath = '/') => {
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }
      
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       setUser(data.user);
//       navigate(redirectPath); // Redirect after successful registration
//       return { success: true, user: data.user };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = (redirectPath = '/login') => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     navigate(redirectPath); // Redirect after logout
//     return { success: true };
//   };

//   return (
//     <UserContext.Provider value={{ 
//       user, 
//       isLoading,
//       login,
//       register,
//       logout,
//       setUser
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook for easy context consumption
// export const useUser = () => {
//   const context = React.useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };















import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user data', error);
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validate token on initial load
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Token is still valid
          setUser(JSON.parse(userData));
        } else {
          logout();
        }
      } catch (error) {
        console.error('Token validation failed', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Secure storage functions
  const secureStore = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('LocalStorage set failed', error);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('LocalStorage remove failed', error);
      }
    }
  };

  const login = useCallback(async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // Helps protect against CSRF
        },
        credentials: 'include', // For cookie-based auth if using
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data securely
      secureStore.set('token', data.token);
      secureStore.set('user', JSON.stringify(data.user));
      
      // Update context
      setUser(data.user);

       // Navigate to user-specific home page
    navigate(`/${data.user.username}/home`);
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        isNetworkError: error.message.includes('Failed to fetch')
      };
    }
  }, [navigate]);

  const register = useCallback(async (formData, redirectPath = '/') => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      secureStore.set('token', data.token);
      secureStore.set('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate(redirectPath);
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        isNetworkError: error.message.includes('Failed to fetch')
      };
    }
  }, [navigate]);

  const logout = useCallback((redirectPath = '/login') => {
    // Optional: Send logout request to backend to invalidate token
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch(error => {
      console.error('Logout API call failed', error);
    });
    
    // Clear local storage and state
    secureStore.remove('token');
    secureStore.remove('user');
    setUser(null);
    navigate(redirectPath);
    return { success: true };
  }, [navigate]);

  // Add refresh token functionality
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/refresh', {
        method: 'POST',
        credentials: 'include' // For cookie-based refresh tokens
      });
      
      const data = await response.json();
      
      if (response.ok) {
        secureStore.set('token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed', error);
      return false;
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading,
      login,
      register,
      logout,
      refreshToken,
      setUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};