package dellingr

import (
	"dagger.io/dagger"
	"dagger.io/dagger/core"
	"universe.dagger.io/alpine"
	"universe.dagger.io/bash"
	"universe.dagger.io/docker"
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
	}

	actions: {
		deps: docker.#Build & {
			steps: [
				alpine.#Build & {
					packages: {
						bash: {}
						git: {}
						yarn: {}
					}
				},
				docker.#Copy & {
					contents: client.filesystem."./".read.contents
					dest:     "/usr/src/app"
				},
				bash.#Run & {
					workdir: "/usr/src/app"
					script: contents: #"""
						yarn install --immutable
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
	}
}
