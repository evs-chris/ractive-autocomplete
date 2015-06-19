# Ractive AutoComplete

An autocomplete input box built on [Ractive](https://github.com/ractivejs/ractive)

## Where to get it?

Racive AutoComplete is available as a [giblet](https://github.com/evs-chris/gobble-giblet), a [component](https://github.com/componentjs/component), and a pre-assembled UMD module. Each flavor does not declare an explicit dependency on Ractive, but it is expected to be available as a global.

All of the pre-built files live in tags on the build branch.

### Development

Ractive AutoComplete uses [gobble](https://github.com/gobblejs/gobble) as its build tool, which makes it easy to build and play around with. The default mode in the gobble file is `development`, which will automatically pull in the edge version of Ractive and make it available along with the sandbox. There is an example file provided along with the source, which you can access by running gobble and pointing you browser at http://localhost:4567/sandbox/example.html.

## Usage

To use AutoComplete, add component reference to your template.

### Attributes

* `completeWith` - method or parameter - a function that receives the current text and returns either an array of completions or a `Promise` for an array of completions.

* `displayMember` - parameter - Either:
  1. The name of the member of a completion object to use as text.
  2. A function that receives a completion value and returns a string.

* `value` - parameter - the current value for the input.

### Events

* `comlpete` - fires when a completion is selected. Parameters:
  1. `text` - the text of the selected completion
  2. `index` - the index of the selected completion
  3. `value` - the selected completion

### Client

A half second after text is entered, the completion function is called for completions. Once the completions are provided, the completion popup is shown for selection. The up and down arrow keys navigate among the available completions. Enter will select one, and escape will close the popup. Typing further will cause the completion function to be called again to refine the completions.

If the input is focused, pressing the down arrow will cause the completion popup to be shown with the last list of completions.
