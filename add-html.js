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

    return addHtmlInside(container, html)
  }

  addHtml.defaultIn =
    function(selector, handler) {
      var oldSelector = focusSelector
      focusSelector = selector
      if (handler) {
        handler()
        focusSelector = oldSelector
      }
    }

  addHtml.inside = addHtmlInside

  addHtml.firstIn = addHtmlFirstIn

  addHtml.before = addHtmlBefore

  addHtml.after = addHtmlAfter

  addHtml.inPlaceOf = addHtmlInPlaceOf

  addHtml.atTopOf = addHtmAtTopOf

  function addHtmAtTopOf(container, newHtml) {
    var oldLeader = container.firstChild

    if (oldLeader) {
      addHtml.before(oldLeader, newHtml)
    } else {
      addHtml.inside(container, newHtml)
    }
  }

  function addHtmlInside(container, newHtml) {
    if (typeof container == "string") {
      container = document.querySelector(container)
    } else if (!isNode(container)) {
      throw new Error("If you want to addHtml in or around a DOM node, you need to pass either  a selector string or a DOM node. You passed "+container)
    }
    
    return eachNode(newHtml, function(node) {
      container.appendChild(node)
    })
  }

  function addHtmlFirstIn(container, newHtml) {

    if (typeof container == "string") {
      container = document.querySelector(container)
    } else if (!isNode(container)) {
      throw new Error("If you want to addHtml in or around a DOM node, you need to pass either  a selector string or a DOM node. You passed "+container)
    }
    
    return eachNode(newHtml, function(node) {
      container.prepend(node)
    })
  }
  function isNode(thing){
    if (typeof Node === "object") {
      return thing instanceof Node
    }

    return thing && typeof thing === "object" && typeof thing.nodeType === "number" && typeof thing.nodeName === "string"
  }

  function addHtmlInPlaceOf(oldChild, newHtml) {

    if (oldChild == null) {
      throw new Error("Tried to replace null with some HTML. You probably queried the DOM and didn't get anything back and then passed it to addHtml.inPlaceOf.")
    }

    var parent = oldChild.parentNode

    var lastAdded

    return eachNode(newHtml, function(node) {
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

    return eachNode(newHtml, function(node) {
      parent.insertBefore(node, sibling)
    })
  }

  function addHtmlAfter(sibling, newHtml) {

    if (sibling.nextSibling) {
      return addHtmlBefore(sibling.nextSibling, newHtml)
    } else {
      var parent = sibling.parentNode
      return eachNode(newHtml, function(node) {
        parent.appendChild(node)
      })
    }
  }

  function eachNode(html, callback) {

    if (html.__isNrtvElement) {
      throw new Error("addHtml expects you to give it an HTML string. You gave it a web element:\n\n"+html.html()+"\n\nTry addHtml(yourElement.html())\n")
    }

    var crucible = document.createElement('div')

    crucible.innerHTML = html

    var lastNode
    var nodes = []

    while(crucible.childNodes.length > 0) {
      var nextNode = crucible.childNodes[0]
      nodes.push(nextNode)
      if (lastNode == nextNode) {
        throw new Error("eachNode callback needs to remove the node it gets from the crucible.")
      } else {
        lastNode = nextNode
      }
      callback(nextNode)
    }
    
    return nodes
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
