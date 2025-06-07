import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const {
    state: { user },
    setUser,
  } = useAuth();

  useEffect(() => {
    const subscription = supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload: any) => {
          if (payload.new.id === user?.id) {
            setUser(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, setUser]);

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name}</p>
      <p>Level: {user?.level}</p>
      <p>
        XP: {user?.currentXP}/{user?.xpToNextLevel}
      </p>
      <p>Streak: {user?.streakDays} days</p>
    </div>
  );
}
