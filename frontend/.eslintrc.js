module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "standard-preact"],
    "rules": {
        "indent": [
            "warn",
            2,
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
          1,
            "always"
        ],
        "no-console": [1, { allow: ["warn", "error"] }],
        "no-debugger": 1,
        "object-curly-spacing": ["warn", "always"],
        "prefer-const": ["warn", {
          "destructuring": "any",
          "ignoreReadBeforeAssign": false
        }]
    },
    "parserOptions": {
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true,
        "jsx": true
      },
      "sourceType": "module"
    },
    "globals": {
      NODE_ENV_DEV: true,
      API_V1_URL: true,
      API_V2_URL: true,
      GOOGLE_ANALYTICS_KEY: true,
      USER_REPORT_KEY: true,
      DATA_DOWNLOAD_ENABLED: true,
      DATA_FORM_ENDPOINT: true,
      DATA_FORM_ENABLED: true,
      PDF_DOWNLOAD_URL: true,
      ga: true,
      fetch: true
    },
    "plugins": [
      "react"
    ]
};
