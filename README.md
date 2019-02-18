A small helper library that takes care of turning HTML into DOM nodes, finding parents and siblings, and inserting new nodes relative to them:

```javascript
var third = document.querySelector("li:nth-of-type(3)")

var newHtml = "<div>A wild div appeared</div>"

addHtml.before(third, newHtml)
addHtml.after(third, newHtml)
addHtml.inside(third, newHtml)
addHtml.inPlaceOf(third, newHtml)
```

Or just add it to the bottom of the DOM:

```javascript
addHtml(newHtml)
```

If you want to do something with the nodes that were added, they are returned:

```javascript
var items = addHtml("<li>one</li><li>two</li><li>three</li>")
items[0].classList.add("selected")
```
### Designate a default place for things to get added

If you would like to have modules that add html to a centralized location on the page, without having to coordinate that location with each module, you can set a default container to add to:

```javascript
addHtml.defaultIn(".content")
addHtml("<b>Hiya</b>")
```

This will add **Hiya** to the `.content` div, as will any subsequent addHtml calls with no specific container or relative element.

You can also just set the default temporarily by passing a handler function:

```javascript
addHtml.defaultIn(".content")
// ...
addHtml.defaultIn(".sidebar-notes", function() {
  addStuffHere()
  moreStuff() // these modules can all use addHtml 
              // with no parameters, and any code
              // they add will go into the sidebar
})
addHtml("process complete") // this goes in .content
```
