# BlendSDK TestFramework

To add a new tests, you can create a new file by the following naming convention in the 
test folder: MyTests.test.ts:

## Example
```TypeScript
/// <reference path="../TestFramework.ts" />
TestRunner.defineTest('My Tests', function(t: Blend.testing.TestRunner) {
    t.equal(1, 1, '1==1');
    t.notEqual(1, 2, '1 != 2');
    t.isOk({}, '{} is ok');
    t.isNotOk(undefined, 'is undefined');
    t.isNotOk(null, 'is null');
    t.isTrue(true, 'is true');
    t.isFalse(false, 'is false');
    t.throws_exception(function() {
        throw new Error('sanity');
    }, 'should throw exception');
    t.delay(function() {
        t.done();
    });
});
```
