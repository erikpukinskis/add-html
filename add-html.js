if (require) {
  module.exports = generator()
} else {
  var addHtml = generator()
}

function generator() {

  var cachedBody

  function body() {
    if (!cachedBody) {
      cachedBody = document.querySelector("body")
    }
    return cachedBody
  }

  function addHtmlToContainer(container, newHtml) {
    
    var crucible = document.createElement('div')

    crucible.innerHTML = newHtml

    for(var i=0; i<crucible.childNodes.length; i++) {
      var child = crucible.childNodes[i]
      container.appendChild(child)
    }

  }

  function addHtml(html) {
    if (window.__nrtvFocusSelector) {
      var container = document.querySelector(window.__nrtvFocusSelector)
    } else {
      container = document.body
    }

    addHtmlToContainer(container, html)
  }

  addHtml.inside = addHtmlToContainer

  addHtml.inPlaceOf =
    function replaceNodeWithHtml(oldChild, newHtml) {

      if (oldChild == null) {
        throw new Error("Tried to replace null with some HTML. You probably queried the DOM and didn't get anything back and then passed it to addHtml.inPlaceOf.")
      }

      var newChild = htmlToNode(newHtml)

      var parent = oldChild.parentNode

      parent.replaceChild(newChild, oldChild)
    }

  function htmlToNode(html) {
    var crucible = document.createElement('div')
    crucible.innerHTML = html
    return crucible.firstChild
  }

  function insertHtmlBefore(sibling, newHtml) {
    if (typeof newHtml != "string") {
      throw new Error("You are trying to add \""+JSON.stringify(newHtml)+"\" as HTML but it's not a string. HTML is strings homeslice.")
    }

    var parent = sibling.parentNode
    var newNode = htmlToNode(newHtml)
    parent.insertBefore(newNode, sibling)
  }

  addHtml.before = insertHtmlBefore

  addHtml.after =
    function insertHtmlAfter(sibling, newHtml) {
      var newNode = htmlToNode(newHtml)

      if (sibling.nextSibling) {
        insertHtmlBefore(sibling.nextSibling, newHtml)
      } else {
        var parent = sibling.parentNode
        parent.appendChild(newNode)
      }
    }
  
  return addHtml
}