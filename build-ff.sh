npm run build
cd dist
web-ext build --overwrite-dest
web-ext -vv sign --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET