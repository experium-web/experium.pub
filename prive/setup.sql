-- Experium : données privées lisibles seulement par les comptes autorisés.
-- Exécuter une fois dans le SQL Editor du projet Supabase.
-- Aucune inscription libre : désactiver les inscriptions publiques dans Auth.

create table if not exists public.private_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.private_pages (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

alter table public.private_members enable row level security;
alter table public.private_pages enable row level security;

-- Accorder uniquement SELECT aux utilisateurs authentifiés.
revoke all on table public.private_members from anon, authenticated;
revoke all on table public.private_pages from anon, authenticated;
grant select on table public.private_members to authenticated;
grant select on table public.private_pages to authenticated;

drop policy if exists "Members see own membership" on public.private_members;
create policy "Members see own membership"
on public.private_members for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Approved members read private pages" on public.private_pages;
create policy "Approved members read private pages"
on public.private_pages for select
to authenticated
using (
  exists (
    select 1 from public.private_members m
    where m.user_id = (select auth.uid())
  )
);

-- APRÈS création d'un compte dans Authentication > Users :
-- Remplacer l'adresse ci-dessous et décommenter pour autoriser cet utilisateur.
-- insert into public.private_members (user_id)
-- select id from auth.users where email = 'votre-adresse@example.com'
-- on conflict (user_id) do nothing;

-- Exemple de contenu privé (à ajouter dans le SQL Editor, PAS dans GitHub) :
-- insert into public.private_pages (title, body)
-- values ('Notes du projet', 'Cette information est conservée dans Supabase.');
