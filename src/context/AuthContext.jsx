/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get Supabase session", error);
      }

      if (isMounted) {
        setSession(session ?? null);
        setUser(session?.user ?? null);
        setInitializing(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      setInitializing(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const syncProfile = async () => {
      const payload = {
        id: user.uid,
        email: user.email,
        username:
          user.user_metadata?.user_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          null,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.user_name ||
          null,
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        last_login_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload, {
        onConflict: "id",
      });

      if (error && !cancelled) {
        console.error("Failed to sync user profile", error);
      }
    };

    syncProfile();

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setRole(data.role);
      } else {
        // Default to user if not found or error, though syncProfile should ensure existence
        setRole("user");
      }
    };

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const signUp = async (email, password, username, avatarFile) => {
    // STEP 1: Create the user FIRST
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          user_name: username,
          full_name: username,
        },
      },
    });

    if (error) throw error;

    // STEP 2: Upload Avatar (Only runs if user is created)
    let avatarUrl = null;
    if (avatarFile && data?.user) {

      // ✅ FIX: Use User ID for filename, NOT Math.random()
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${data.user.id}.${fileExt}`;
      const filePath = fileName; // Simple path: just the filename

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        console.error("Avatar upload failed:", uploadError);
      } else {
        // Get the URL
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
        console.log("Avatar uploaded successfully:", avatarUrl);

        // STEP 3: Update the user's metadata with the URL
        await supabase.auth.updateUser({
          data: { avatar_url: avatarUrl }
        });
      }
    }

    // STEP 4: Save to Profiles Database
    if (data?.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        username: username,
        full_name: username,
        avatar_url: avatarUrl,
      }, { onConflict: "id" });
    }

    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const loginWithGoogle = () => {
    const redirectTo =
      typeof window !== "undefined" ? window.location.origin : undefined;
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Failed to sign out", error);
    }
  };

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      initializing,
      signUp,
      signIn,
      loginWithGoogle,
      signOut,
    }),
    [session, user, role, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
