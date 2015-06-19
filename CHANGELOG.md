## 0.4.0

* The component now uses an isolated scope.
* Fixes placeholder handling
* Removes Ractive deprecation warnings
* The package manifest is now available on the build branch.

## 0.3.1

* Removes leftover debug logging statement

## 0.3.0

* Now uses laziness built into Ractive instead of DelayedInput
* There is now a value binding available to use instead of having to listen to `complete` events for changes.
* `displayMember` may now be a function, and there is no `valueMember` any more.
* `completeWith` may now be bound as a component parameter.

## 0.2.0

* Adds support for having different value and display members.

## 0.1.0

* Adds support for promised completions. When the complete function returns a promise, completions will be set from its resolution.
* Adds a complete event that fires when a selection is indicated: on blur, click, and enter.
* The default style will not limit the width of completions, but care must still be taken in fixed with containers with overflow control.

## 0.0.2

* Exports DelayedInput along with AutoComplete

## 0.0.1

Initial version
