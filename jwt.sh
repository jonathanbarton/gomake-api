curl --request POST \
  --url https://gomake.auth0.com/oauth/token \
  --header \'content-type: application/json\' \
  --data \'\{\"client_id\":\"${GM_JWT_AUDIENCE}\",\"client_secret\":\"${GM_JWT_SECRET}\",\"audience\":\"https://gomake.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"\}\'