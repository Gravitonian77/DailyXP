-- Create a function to delete a user
create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete the user's auth account
  delete from auth.users where id = auth.uid();
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function delete_user() to authenticated; 