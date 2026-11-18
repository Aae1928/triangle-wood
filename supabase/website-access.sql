begin;

grant usage on schema public to anon, authenticated;

drop policy if exists website_closeup_list on storage.objects;
create policy website_closeup_list
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'Images'
    and name like '16 Colours/Close Up Shots/%'
  );

alter table public.sample_requests
  add column if not exists profession text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists postal_code text;

alter table public.sample_requests
  alter column profession drop not null,
  alter column address drop not null,
  alter column postal_code drop not null;

do $$
declare
  table_name text;
  public_catalog_tables text[] := array[
    'categories',
    'colour_variants',
    'interior_scenes',
    'outdoor_specifications',
    'parquetry_designs',
    'parquetry_tiles',
    'pattern_types',
    'product_images',
    'products',
    'timber_scenes',
    'timber_subcategories'
  ];
begin
  foreach table_name in array public_catalog_tables loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('drop policy if exists website_catalog_read on public.%I', table_name);
    execute format(
      'create policy website_catalog_read on public.%I for select to anon, authenticated using (true)',
      table_name
    );
  end loop;
end
$$;

alter table public.sample_requests enable row level security;
alter table public.request_selections enable row level security;
revoke all on public.sample_requests from anon, authenticated;
revoke all on public.request_selections from anon, authenticated;

create or replace function public.submit_sample_request(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_key uuid := gen_random_uuid();
  selection jsonb;
  selected_colour_id uuid;
  selected_pattern_id uuid;
  selected_product_id uuid;
  selection_index integer := 0;
  selections jsonb := payload->'selections';
begin
  if nullif(btrim(payload->>'fullName'), '') is null
    or nullif(btrim(payload->>'email'), '') is null
    or nullif(btrim(payload->>'city'), '') is null then
    raise exception 'Required sample request fields are missing';
  end if;

  if selections is null or jsonb_typeof(selections) <> 'array' then
    raise exception 'Flooring selections must be an array';
  end if;

  if jsonb_array_length(selections) = 0
    and nullif(btrim(payload->>'message'), '') is null then
    raise exception 'Select at least one product';
  end if;

  insert into public.sample_requests (
    request_id, full_name, email, phone, company, message,
    profession, address, city, postal_code, created_at
  )
  values (
    request_key,
    btrim(payload->>'fullName'),
    btrim(payload->>'email'),
    nullif(btrim(payload->>'phone'), ''),
    nullif(btrim(payload->>'company'), ''),
    nullif(btrim(payload->>'message'), ''),
    null,
    null,
    btrim(payload->>'city'),
    null,
    now()
  );

  for selection in select value from jsonb_array_elements(selections) loop
    selection_index := selection_index + 1;
    selected_colour_id := nullif(selection->>'colourId', '')::uuid;
    selected_pattern_id := nullif(selection->>'patternId', '')::uuid;

    if selected_colour_id is null or selected_pattern_id is null then
      raise exception 'A selected colour or pattern is invalid';
    end if;

    select product_id
      into selected_product_id
      from public.products
      where colour_id = selected_colour_id
        and pattern_id = selected_pattern_id
        and is_active
      order by product_id
      limit 1;

    insert into public.request_selections (
      request_id, selection_order, product_id, colour_id, pattern_id
    )
    values (
      request_key, selection_index, selected_product_id,
      selected_colour_id, selected_pattern_id
    );
  end loop;

  return request_key;
end
$$;

revoke all on function public.submit_sample_request(jsonb) from public;
grant execute on function public.submit_sample_request(jsonb) to anon, authenticated;

commit;
