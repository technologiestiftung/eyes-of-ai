![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Through the eyes of AI

An OpenAI-based prototype that uses the Dall-E API to create parametrically personalized image of it's users.
More info coming soon...

## Small Housekeeping TO DOs

- [ ] Do you want to honor all kinds of contributions? Use [all-contributors](https://allcontributors.org/)

```bash
npx all-contributors-cli check
npx all-contributors-cli add ff6347 doc
```

You can use it on GitHub just by commenting on PRs and issues:

```plain
@all-contributors please add @ff6347 for infrastructure, tests and code
```

- [ ] Add your project description
- [ ] Get fancy shields at https://shields.io

## Prerequisites

You'll need an OpenAI API Key. In order to recieve one create an OpenAI account, log into it, create an API key and copy and paste it into your `.env` file

## Installation

Run `npm install`

## Development

Start your local supabase project

Run `supabase start`

Prepare your database:

```sql

insert into storage.buckets
  (id, name)
values
  ('eotai_images', 'eotai_images');

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'eotai_images' );

update "storage".buckets set "public" = TRUE where buckets.id = 'eotai_images';

create table public.eotai_images(
	id uuid not null primary key,
	created_at timestamp not null default now(),
	prompt text not null
);

alter table eotai_images add COLUMN url text;

alter table "public".eotai_images enable row level security;

create policy "Enable read access for all users"
on "public".eotai_images
as permissive
for select
to public
using (true);

```

Run `npm run dev`

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/raphael-arce"><img src="https://avatars.githubusercontent.com/u/8709861?v=4?s=64" width="64px;" alt="Raphael.A"/><br /><sub><b>Raphael.A</b></sub></a><br /><a href="https://github.com/technologiestiftung/eyes-of-ai/commits?author=raphael-arce" title="Code">💻</a> <a href="#ideas-raphael-arce" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://fhp.incom.org/profile/9200/projects"><img src="https://avatars.githubusercontent.com/u/46717848?v=4?s=64" width="64px;" alt="anna"/><br /><sub><b>anna</b></sub></a><br /><a href="#design-annameide" title="Design">🎨</a> <a href="#ideas-annameide" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/julizet"><img src="https://avatars.githubusercontent.com/u/52455010?v=4?s=64" width="64px;" alt="Julia Zet"/><br /><sub><b>Julia Zet</b></sub></a><br /><a href="#design-julizet" title="Design">🎨</a> <a href="https://github.com/technologiestiftung/eyes-of-ai/commits?author=julizet" title="Code">💻</a> <a href="#ideas-julizet" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://fabianmoronzirfas.me"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt="Fabian Morón Zirfas"/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="#design-ff6347" title="Design">🎨</a> <a href="https://github.com/technologiestiftung/eyes-of-ai/commits?author=ff6347" title="Code">💻</a> <a href="#ideas-ff6347" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-ff6347" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Jaszkowic"><img src="https://avatars.githubusercontent.com/u/10830180?v=4?s=64" width="64px;" alt="Jonas Jaszkowic"/><br /><sub><b>Jonas Jaszkowic</b></sub></a><br /><a href="https://github.com/technologiestiftung/eyes-of-ai/commits?author=Jaszkowic" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Content Licensing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/).

## Credits

<table>
  <tr>
    <td>
      Made by <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://citylab-berlin.org/wp-content/uploads/2021/05/citylab-logo.svg" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://citylab-berlin.org/wp-content/uploads/2021/05/tsb.svg" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://citylab-berlin.org/wp-content/uploads/2021/12/B_RBmin_Skzl_Logo_DE_V_PT_RGB-300x200.png" />
      </a>
    </td>
  </tr>
</table>
