const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["images.igdb.com"],
  },
  reactStrictMode: false,
};
