package dellingr

import (
	"dagger.io/dagger"
	"dagger.io/dagger/core"
	"universe.dagger.io/alpine"
	"universe.dagger.io/bash"
	"universe.dagger.io/docker"
	"universe.dagger.io/docker/cli"
)

dagger.#Plan & {
	client: {
		filesystem: {
			"./": read: {
				contents: dagger.#FS
				exclude: [
					".github",
					".husky",
					".vscode",
					"assets",
					"coverage",
					"dist",
					"docs",
					"README.md",
					"dellingr.cue",
				]
			}
			"./dist": write: contents: actions.build.contents.output
		}
		network: "unix:///var/run/docker.sock": connect: dagger.#Socket
	}

	actions: {
		deps: docker.#Build & {
			steps: [
				alpine.#Build & {
					packages: {
						bash: {}
						yarn: {}
						git: {}
					}
				},
				docker.#Copy & {
					contents: client.filesystem."./".read.contents
					dest:     "/usr/src/app"
				},
				bash.#Run & {
					workdir: "/usr/src/app"
					script: contents: #"""
						yarn install
						"""#
				},
			]
		}

		build: {
			run: bash.#Run & {
				input:   deps.output
				workdir: "/usr/src/app"
				script: contents: #"""
					yarn build
					"""#
			}

			contents: core.#Subdir & {
				input: run.output.rootfs
				path:  "/usr/src/app/dist"
			}
		}

		dockerBuild: docker.#Dockerfile & {
			dockerfile: path: "Dockerfile"
			source: client.filesystem."./".read.contents
		}

		lint: bash.#Run & {
			input:   deps.output
			workdir: "/usr/src/app"
			script: contents: #"""
				yarn lint
				"""#
		}

		testUnit: bash.#Run & {
			input:   deps.output
			workdir: "/usr/src/app"
			script: contents: #"""
				yarn test:unit
				"""#
		}

		testIntegration: {
			db: docker.#Build & {
				steps: [
					docker.#Pull & {
						source: "postgres:14-alpine"
					},
					docker.#Run & {
						_config: core.#ImageConfig & {
							healthcheck: core.#HealthCheck & {
								interval: 10
								retries:  5
								test: ["pg_isready"]
								timeout: 5
							}
						}
						env: {
							"POSTGRES_DB":       "dellingr"
							"POSTGRES_PORT":     "5432"
							"POSTGRES_PASSWORD": "masterkey"
							"POSTGRES_USER":     "admin"
						}
					},
				]
			}

			run: cli.#Run & {
				input: db.output
				host:  client.network."unix:///var/run/docker.sock".connect
				command: {
					name: "test:integration"
					args: ["yarn", "test:integration:ci"]
				}
			}
		}
	}
}
