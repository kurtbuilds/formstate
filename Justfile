set dotenv-load := true

export PATH := "./node_modules/.bin:" + env_var('PATH')

help:
    @just --list

bootstrap:
    npm install

build:
    tsc

# Increase version
version level:
    git diff-index --exit-code HEAD > /dev/null || ! echo $(dye -r ERROR) You have untracked changes. Commit your changes before bumping the version
    npm version {{level}}
    git commit -am "bump {{level}} version"
    LIB=$(basename $(pwd)) VERSION=$(rg  "\"version\": \"([0-9.]+)\"" -or '$1' package.json | head -n1) TAG=$LIB-v$VERSION && \
        git tag $TAG && \
        git push origin $TAG
    git push

publish:
    npm publish
    git clean -f

patch:
    just version patch
    just publish
