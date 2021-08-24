# hcanoe

training data and analytics

To build, run `yarn` in the root directory. After that, to start a local server, run `yarn dev`.

Personal training data page are found at `url/YY/NAME`, where `YY` is graduation year and `NAME` is a user-defined string.

[https://hcanoe.vercel.app/19/shermern](https://hcanoe.vercel.app/19/shermern)

Main code is located at `/pages/[year]/[user].tsx`, which in turn mainly reads from `/src/main.ts`.
