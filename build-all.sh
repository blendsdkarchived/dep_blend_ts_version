echo building Blend SDK
tsc @blend-build-config

echo building Blend SDK Tests
rm -fR ./testing/build
tsc @testing-build-config
cp -fR ./build ./testing/build/blend

