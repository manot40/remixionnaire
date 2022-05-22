#!/bin/bash
function prismaClientLambda() {
  echo "Cleaning up workspace ..."
  rm -rf lambda-prisma-client
  
  echo "Creating layer ..."
  mkdir -p lambda-prisma-client/nodejs/node_modules/.prisma
  mkdir -p lambda-prisma-client/nodejs/node_modules/@prisma

  echo "Prepare prisma client lambda layer ..."
  cp -r node_modules/.prisma/client lambda-prisma-client/nodejs/node_modules/.prisma
  cp -r node_modules/@prisma lambda-prisma-client/nodejs/node_modules

  echo "Remove prisma CLI..."
  rm -rf lambda-prisma-client/nodejs/node_modules/@prisma/cli

  echo "Compressing ..."
  pushd lambda-prisma-client && tar -zcf /tmp/nodejs.tar.gz . && mv /tmp/nodejs.tar.gz ./nodejs.tar.gz

  echo "Remove unzipped files ..."
  rm -rf nodejs

  echo "Stats:"
  ls -lh nodejs.tar.gz

  popd
}

prismaClientLambda