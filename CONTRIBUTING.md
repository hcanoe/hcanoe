## Branches
`master` should never break.  
`dev` will be used to test deployments.

## Setting up

### Requirements
Just `git` and `yarn`.

### Building/Running
First, clone the github repository with
```
git clone https://github.com/hcanoe/hcanoe.git
```

To download yarn dependencies, `yarn` in the root directory.
```
cd hcanoe && yarn 
```
After that, to start a local server, run `yarn dev`. By default, this will start a local server at `http://localhost:3000/`

### Existing pages

`http://localhost:3000`  
is the home page.

`http://localhost:3000/YY/NAME`  
will show personal training data, where `YY` is the last two digits of the person's graduation year.  
(example: `http://localhost:3000/19/shermern`)

#### Deployment

This app is currently deployed at `hcanoe.vercel.app`.  
The deployment urls of the above pages will then be  
- `hcanoe.vercel.app`
- `hcanoe.vercel.app/19/shermern`

## Workflow
For each new feature, create a new branch and write a pull request before working on it.  
Discussions can be in the [Github PR page](https://github.com/hcanoe/hcanoe/pulls).

## File structure

### Main outline
```
├─ pages/
├─ src/
│  ├─ components/
│  ├─ styles/
│  ├─ types/
│  ├─ lib/
└─ .env.local
```

#### pages/
All file added to the `pages` directory is automatically available as a route.

`pages/test.js` → `hcanoe.vercel.app/test`  
`pages/docs/index.js` → `hcanoe.vercel.app/docs`

For more information, read the [nextjs documentation](https://nextjs.org/docs/routing/introduction).

#### src/
This is where most of the javascript lives.

## Database
Data is sourced from [Google Drive](https://drive.google.com/drive/folders/1nwzMO1JISqGi67b1wcKCSbFmCTF5g_KU)
using [Google Sheets API](https://developers.google.com/sheets/api/reference/rest)  

### Google Drive file structure
(sheets are denoted by `.s`)
```
hcanoe/
├─ 2021/
│  ├─ run.s
│  ├─ strength.s
│  └─ paddling.s
├─ 2020/
├─ ...
├─ meta.s
└─ readme.s
```

## Coding

### Style
Use [prettier](https://prettier.io/) before pushing.
