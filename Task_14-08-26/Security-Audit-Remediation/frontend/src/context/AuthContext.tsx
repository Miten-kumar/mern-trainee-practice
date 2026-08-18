import {createContext,useContext,useEffect,useState,type ReactNode,} from "react";
import {getCurrentUser,loginUser,logoutUser} from "../api/auth.api";
import type {LoginInput} from "../types/auth.types";
import type { User } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    data: LoginInput
  ) => Promise<void>;

  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  /**
   * Check authentication
   * when application starts
   */
  useEffect(() => {
    const checkAuthentication =
      async (): Promise<void> => {
        try {
          const response =
            await getCurrentUser();

          if (
            response.success &&
            response.data
          ) {
            setUser(response.data);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    void checkAuthentication();
  }, []);

  /**
   * Login
   */
  const login = async (
    data: LoginInput
  ): Promise<void> => {
    const response =
      await loginUser(data);

    if (
      response.success &&
      response.data
    ) {
      setUser(response.data);
    }
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth must be used inside AuthProvider"
      );
    }

    return context;
  };