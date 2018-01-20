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
