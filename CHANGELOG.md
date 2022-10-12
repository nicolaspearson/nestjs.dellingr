# Changelog

## [1.2.0](https://github.com/nicolaspearson/nestjs.dellingr/compare/v1.1.0...v1.2.0) (2022-08-26)


### Features

* remove newrelic ([758da21](https://github.com/nicolaspearson/nestjs.dellingr/commit/758da21e74ecb96cb6241a108292798650211e15))


### Bug Fixes

* adapt new relic logger ([0ac6097](https://github.com/nicolaspearson/nestjs.dellingr/commit/0ac6097caef93e0084601d40783def73393947cb))

## [1.1.0](https://github.com/nicolaspearson/nestjs.dellingr/compare/v1.0.2...v1.1.0) (2022-06-28)


### Features

* integrate newrelic ([#260](https://github.com/nicolaspearson/nestjs.dellingr/issues/260)) ([2bb9f01](https://github.com/nicolaspearson/nestjs.dellingr/commit/2bb9f013f0d0cfd4c8b2d4ddf07b96c55346894e))


### Bug Fixes

* pin aws-sdk-js-v3 monorepo ^3.118.1 ([#268](https://github.com/nicolaspearson/nestjs.dellingr/issues/268)) ([ad7b6bd](https://github.com/nicolaspearson/nestjs.dellingr/commit/ad7b6bd2142da98bbeb3498738e13a86056affb8))
* remove redundant dockerfile copy commands ([421f813](https://github.com/nicolaspearson/nestjs.dellingr/commit/421f813f5331b96bb156f0c458d878d0f4cb6f1f))

## [1.0.2](https://github.com/nicolaspearson/nestjs.dellingr/compare/v1.0.1...v1.0.2) (2022-06-03)


### Bug Fixes

* update config service usage in main.ts ([f8afe7f](https://github.com/nicolaspearson/nestjs.dellingr/commit/f8afe7fb482922d59aec67e6d926474c52e9271a))

### [1.0.1](https://github.com/nicolaspearson/nestjs.dellingr/compare/v1.0.0...v1.0.1) (2022-05-30)


### Bug Fixes

* add markdownlint ignore ([30fa3d6](https://github.com/nicolaspearson/nestjs.dellingr/commit/30fa3d62d8d8cc262e89eb9409bc3efd2cd7455f))

## 1.0.0 (2022-05-30)


### Features

* add controllers and services ([903f6db](https://github.com/nicolaspearson/nestjs.dellingr/commit/903f6db350c3da9a5f2bc5e7183d78529aa32bbb))
* add create tx endpoint ([0c5b29e](https://github.com/nicolaspearson/nestjs.dellingr/commit/0c5b29e7c5a213a77bbaeb2e1d4d36c151fc574f))
* add docker file ([115a666](https://github.com/nicolaspearson/nestjs.dellingr/commit/115a666db4e389f3249578b7573b9412a94b860a))
* add entities ([646daf2](https://github.com/nicolaspearson/nestjs.dellingr/commit/646daf205866f2fb2b68114a316ae857a00af44d))
* add health module ([4258350](https://github.com/nicolaspearson/nestjs.dellingr/commit/4258350627bc2d080923e4adf32d85ca9680569b))
* add load tests for registration ([0f7fe02](https://github.com/nicolaspearson/nestjs.dellingr/commit/0f7fe022cfa5ee68c4321c3307e155a273a5ffef))
* add wallet and tx controllers ([6a06c9c](https://github.com/nicolaspearson/nestjs.dellingr/commit/6a06c9c682edd531ca3c5caec98424b3dd2d2f5b))
* add wallet and tx response dtos ([3f0c49d](https://github.com/nicolaspearson/nestjs.dellingr/commit/3f0c49d0d3bf2895a39254d463e002d2abb9244b))
* aws-sdk (v2) s3 document upload ([#18](https://github.com/nicolaspearson/nestjs.dellingr/issues/18)) ([bc75e23](https://github.com/nicolaspearson/nestjs.dellingr/commit/bc75e2351df4b0132391562a7a1b1deb9d2da8d5))
* expand repositories ([388ff96](https://github.com/nicolaspearson/nestjs.dellingr/commit/388ff9690db9895658012a005fb706410729b683))
* implement commitlint ([5c4d480](https://github.com/nicolaspearson/nestjs.dellingr/commit/5c4d48031a4cdd9c31fba2bb976477cacb9625be))
* implement typed config module ([#24](https://github.com/nicolaspearson/nestjs.dellingr/issues/24)) ([67ea8d9](https://github.com/nicolaspearson/nestjs.dellingr/commit/67ea8d94ae227fad55a816c7cafd44551bcbc9e1))
* implement unit-of-work ([#11](https://github.com/nicolaspearson/nestjs.dellingr/issues/11)) ([a3c384d](https://github.com/nicolaspearson/nestjs.dellingr/commit/a3c384d93e190fb5de0554ded4ead2908486e9ab))
* improve config implementation ([#192](https://github.com/nicolaspearson/nestjs.dellingr/issues/192)) ([130fc4e](https://github.com/nicolaspearson/nestjs.dellingr/commit/130fc4e964e3379043ceb2c359e7a6c7553e78d9))
* initial commit ([164ee72](https://github.com/nicolaspearson/nestjs.dellingr/commit/164ee72566522213d48b8c02f9d91cfd93c13041))
* integrate ewl ([f258648](https://github.com/nicolaspearson/nestjs.dellingr/commit/f258648df789103fe85e1c5a76386550d407ff51))
* integrate typeorm ([628517b](https://github.com/nicolaspearson/nestjs.dellingr/commit/628517bf295e6d2a14e9be67146b3b349b7798f5))
* localstack integration ([#20](https://github.com/nicolaspearson/nestjs.dellingr/issues/20)) ([78a38ed](https://github.com/nicolaspearson/nestjs.dellingr/commit/78a38edc57123d9bbca897f12fc4fa679be330f6))
* migrate to nest-typed-config-extended ([e096aac](https://github.com/nicolaspearson/nestjs.dellingr/commit/e096aac4bfc50d30c06e577b27cb534c1acef480))
* refactor services and add unit tests ([98a3a97](https://github.com/nicolaspearson/nestjs.dellingr/commit/98a3a970eadb07b03f9e12c52aefe2e9b5abc6cf))
* use async local storage in the db tx service ([#15](https://github.com/nicolaspearson/nestjs.dellingr/issues/15)) ([04d4c42](https://github.com/nicolaspearson/nestjs.dellingr/commit/04d4c427e4cafa1de724523bedde268a91bba468))
* use webpack to bundle the app ([c21ade1](https://github.com/nicolaspearson/nestjs.dellingr/commit/c21ade1b9e542f15d8a040067030abedda9459d8))


### Bug Fixes

* add yarn db:start to dts generate script ([7ee59df](https://github.com/nicolaspearson/nestjs.dellingr/commit/7ee59df593fbf75dad33311718c3418255b83619))
* create dist dir if not exists ([641c22d](https://github.com/nicolaspearson/nestjs.dellingr/commit/641c22dd2caf52413b393a1a81b88d97a958f280))
* db migration generator ([b847957](https://github.com/nicolaspearson/nestjs.dellingr/commit/b84795786a686507d4344e0e5025f0b41b61dd32))
* multer file type definition ([ba25550](https://github.com/nicolaspearson/nestjs.dellingr/commit/ba255506f4891ab1469d84995802f292439ef494))
* pg container errors ([effdae0](https://github.com/nicolaspearson/nestjs.dellingr/commit/effdae0a158152f0f76f66e203309a3a7909ad93))
* reconfigure db migration generator ([cbd27ad](https://github.com/nicolaspearson/nestjs.dellingr/commit/cbd27ade1911b78c7b723e32e5ac33b88f215e23))
* remove $ sign from readme commands ([0375295](https://github.com/nicolaspearson/nestjs.dellingr/commit/037529528c764caae57d91d3a3e65be88306d303))
* remove whitespace ([1e4b9dc](https://github.com/nicolaspearson/nestjs.dellingr/commit/1e4b9dc5a5bdf602688f8087c4cc453804b7c8fa))
* replace deprecated inject connection decorator ([884febd](https://github.com/nicolaspearson/nestjs.dellingr/commit/884febdd08f991374cc88b5e14ecdee2832cd28f))
* update opaque types ([ae40d31](https://github.com/nicolaspearson/nestjs.dellingr/commit/ae40d31cb2f9cab4909b1c2164fcdf427aa06556))
* yarn start script ([3710082](https://github.com/nicolaspearson/nestjs.dellingr/commit/3710082bf15392c58a8f69e3198d87128fb668b1))
