docker run -d \
  -h redis \
  -e REDIS_PASSWORD=redis \
  -v redis-data:/data \
  -p 6379:6379 \
  --name redis \
  --restart always \
  redis /bin/sh -c 'redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}'