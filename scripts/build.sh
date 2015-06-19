#!/usr/bin/env sh

if [[ ! -d '.git' ]]; then
  echo "Run this from the project root as 'script/build.sh'."
  exit 1
fi

rm -r build
gobble build -f build

if [[ $? -ne 0 ]]; then
  echo "Gobble build failed..."
  exit 1
fi

# fill in the rest of the files
cp README.md LICENSE.md component.json giblet.json package.json build

# move to the build branch
git checkout build

if [[ $? -ne 0 ]]; then
  git checkout --orphan build
fi

# no longer needed stuff
ls | grep -v build | grep -v node_modules | while read file; do rm -r "$file"; done

cp -r build/* ./
rm -r build
