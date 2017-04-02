if (require) {
  module.exports = require("module-library")(require).export("add-html", generator)
} else {
  var addHtml = generator()
}

function generator() {

  var focusSelector

  function addHtml(html) {
    if (focusSelector) {
      var container = document.querySelector(focusSelector)

      if (!container) {
        throw new Error("You wanted to add HTML to "+focusSelector+" by default, but we can't find any elements that match that selector.")
      }
    } else {
      container = document.body
    }

    addHtmlInside(container, html)
  }

  addHtml.defaultIn =
    function(selector) {
      focusSelector = selector
    }

  addHtml.inside = addHtmlInside

  addHtml.before = addHtmlBefore

  addHtml.after = addHtmlAfter

  addHtml.inPlaceOf = addHtmlInPlaceOf

  function addHtmlInside(container, newHtml) {

    if (typeof container == "string") {
      container = document.querySelector(container)
    }
    
    eachNode(newHtml, function(node) {
      container.appendChild(node)
    })
  }

  function addHtmlInPlaceOf(oldChild, newHtml) {

    if (oldChild == null) {
      throw new Error("Tried to replace null with some HTML. You probably queried the DOM and didn't get anything back and then passed it to addHtml.inPlaceOf.")
    }

    var parent = oldChild.parentNode

    var lastAdded

    eachNode(newHtml, function(node) {
      if (lastAdded) {
        parent.replaceChild(node, oldChild)
      } else {
        if (lastAdded.nextSibling) {
          parent.insertBefore(node, lastAdded.nextSibling)
        } else {
          parent.appendChild(node)
        }
      }
      lastAdded = node
    })
  }

  function addHtmlBefore(sibling, newHtml) {
    if (typeof newHtml != "string") {
      throw new Error("You are trying to add \""+JSON.stringify(newHtml)+"\" as HTML but it's not a string. HTML is strings homeslice.")
    }

    var parent = sibling.parentNode

    eachNode(newHtml, function(node) {
      parent.insertBefore(node, sibling)
    })
  }

  function addHtmlAfter(sibling, newHtml) {

    if (sibling.nextSibling) {
      addHtmlBefore(sibling.nextSibling, newHtml)
    } else {
      var parent = sibling.parentNode
      eachNode(newHtml, function(node) {
        parent.appendChild(node)
      })
    }
  }

  function eachNode(html, callback) {

    var crucible = document.createElement('div')

    crucible.innerHTML = html

    var lastNode

    while(crucible.childNodes.length > 0) {
      var nextNode = crucible.childNodes[0]
      if (lastNode == nextNode) {
        throw new Error("eachNode callback needs to remove the node it gets from the crucible.")
      } else {
        lastNode = nextNode
      }
      callback(nextNode)
    }
  }

  addHtml.defineOn = function(bridge) {
    var binding = bridge.remember("add-html")

    if (!binding) {
      binding = bridge.defineSingleton("addHtml", generator)
      bridge.see("add-html", binding)
    }

    return binding
  }

  return addHtml
}
