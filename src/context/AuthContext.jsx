import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../services/supabase';
// The goal of this component is to make user and website_id everywhere in the app with the hook useAuth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [websiteId, setWebsiteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // we create a function that will extract website_id from admins based on user_id
  async function getAdminData(userId) {
    const { data, error } = await supabase
      .from('admins')
      .select('website_id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(error.message);
      return null;
    }

    return data.website_id;
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          setTimeout(async () => {
            try {
              const websiteId = await getAdminData(session.user.id);

              setUser(session.user);
              setWebsiteId(websiteId);
            } catch (error) {
              console.error(error.message);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setLoading(false);
        }
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setWebsiteId(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    websiteId,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
