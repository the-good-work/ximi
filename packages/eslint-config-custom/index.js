module.exports = {
  extends: ["next", "turbo", "prettier", "plugin:react/jsx-runtime"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
