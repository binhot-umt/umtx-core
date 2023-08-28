

# UMT-X Core Back-end
Đây là repo của back-end viết bằng NestJS xử lý và centerlize các thông tin chính nhằm cung cấp cho các services.

# Requirements

Yêu cầu 
```
nodejs > 16.0.0
nestjs-cli
@nestjs/* (common, bull)
redis
```


# Installation package for developing

```bash
$ yarn global add @nestjs/cli
```

```bash
$ yarn install --force
```

## Running the app / dev
```bash
$ yarn build
```

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Build

```
docker build . -t {{image_name}}
```

## License

Nest is [MIT licensed](LICENSE).
