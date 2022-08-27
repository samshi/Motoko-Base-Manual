modules.RBTree={"imports":{"Debug":"Debug","Iter":"I","List":"List","Nat":"Nat","Order":"O"},"functions":{"Color":{"desc":"Node color: red or black.","body":"public type Color= { #R; #B };"},"Tree":{"desc":"// Ordered, (red-black) tree of entries.","body":"public type Tree<X, Y> = {\n  #node : (Color, Tree<X, Y>, (X, ?Y), Tree<X, Y>);\n  #leaf;\n}"},"RBTree":{"desc":"Create an order map from an order function for its keys.","body":"public class RBTree<X, Y>(compareTo : (X, X) -> O.Order) {\n\n  var tree : Tree<X, Y> = (#leaf : Tree<X, Y>);\n\n  /// Tree as sharable data.\n  ///\n  /// Get non-OO, purely-functional representation:\n  /// for drawing, pretty-printing and non-OO contexts\n  /// (e.g., async args and results):\n  public func share() : Tree<X, Y> {\n    tree\n  };\n\n  /// Get the value associated with a given key.\n  public func get(x : X) : ?Y {\n    getRec(x, compareTo, tree);\n  };\n\n  /// Replace the value associated with a given key.\n  public func replace(x : X, y : Y) : ?Y {\n    let (res, t) = insertRoot(x, compareTo, y, tree);\n    tree := t;\n    res\n  };\n\n  /// Put an entry: A value associated with a given key.\n  public func put(x : X, y : Y) {\n    let (res, t) = insertRoot(x, compareTo, y, tree);\n    tree := t;\n  };\n\n  /// Delete the entry associated with a given key.\n  public func delete(x : X) {\n    let (res, t) = removeRec(x, compareTo, tree);\n    tree := t\n  };\n\n  /// Remove the entry associated with a given key.\n  public func remove(x : X) : ?Y {\n    let (res, t) = removeRec(x, compareTo, tree);\n    tree := t;\n    res\n  };\n\n  /// An iterator for the key-value entries of the map, in ascending key order.\n  ///\n  /// iterator is persistent, like the tree itself\n  public func entries() : I.Iter<(X, Y)> { iter(tree, #fwd) };\n\n  /// An iterator for the key-value entries of the map, in descending key order.\n  ///\n  /// iterator is persistent, like the tree itself\n  public func entriesRev() : I.Iter<(X, Y)> { iter(tree, #bwd) };\n\n}"},"iter":{"desc":"An iterator for the entries of the map, in ascending (`#fwd`) or descending (`#bwd`) order.","body":"public func iter<X, Y>(t : Tree<X, Y>, dir : { #fwd; #bwd }) : I.Iter<(X, Y)> {\n  object {\n    var trees : IterRep<X, Y> = ?(#tr(t), null);\n    public func next() : ?(X, Y) {\n      switch (dir, trees) {\n        case (_, null) { null };\n        case (_, ?(#tr(#leaf), ts)){\n          trees := ts;\n          next()\n        };\n        case (_, ?(#xy(xy), ts)) {\n          trees := ts;\n          switch (xy.1) {\n            case null { next() };\n            case (?y) { ?(xy.0, y) }\n          }\n        };\n        case (#fwd, ?(#tr(#node(_, l, xy, r)), ts)) {\n          trees := ?(#tr(l), ?(#xy(xy), ?(#tr(r), ts)));\n          next()\n        };\n        case (#bwd, ?(#tr(#node(_, l, xy, r)), ts)) {\n          trees := ?(#tr(r), ?(#xy(xy), ?(#tr(l), ts)));\n          next()\n        };\n      }\n    };\n  }\n}"},"size":{"desc":"The size of the tree as the number of key-value entries.","body":"public func size<X, Y>(t : Tree<X, Y>) : Nat {\n  switch t {\n    case (#leaf) { 0 };\n    case (#node(_, l, xy, r)) {\n      size(l) + size(r) + (switch (xy.1) { case null 0; case _ 1 });\n    };\n  }\n}"}},"related":"type IterRep<X, Y> = List.List<{ #tr:Tree<X, Y>; #xy:(X, ?Y) }>;\n/// Remove the value associated with a given key.\nfunc removeRec<X, Y>(x : X, compareTo : (X, X) -> O.Order, t : Tree<X, Y>)\n  : (?Y, Tree<X, Y>) {\n  switch t {\n    case (#leaf) { (null, #leaf) };\n    case (#node(c, l, xy, r)) {\n      switch (compareTo(x, xy.0)) {\n        case (#less) {\n          let (yo, l2) = removeRec(x, compareTo, l);\n          (yo, #node(c, l2, xy, r))\n        };\n        case (#equal) {\n          (xy.1, #node(c, l, (x, null), r))\n        };\n        case (#greater) {\n          let (yo, r2) = removeRec(x, compareTo, r);\n          (yo, #node(c, l, xy, r2))\n        };\n      }\n    }\n  }\n};\nfunc bal<X, Y>(color : Color, lt : Tree<X, Y>, kv : (X, ?Y), rt : Tree<X, Y>) : Tree<X, Y> {\n  // thank you, algebraic pattern matching!\n  // following notes from [Ravi Chugh](https://www.classes.cs.uchicago.edu/archive/2019/spring/22300-1/lectures/RedBlackTrees/index.html)\n  switch (color, lt, kv, rt) {\n    case (#B, #node(#R, #node(#R, a, x, b), y, c), z, d) {\n      #node(#R, #node(#B, a, x, b), y, #node(#B, c, z, d))\n    };\n    case (#B, #node(#R, a, x, #node(#R, b, y, c)), z, d) {\n      #node(#R, #node(#B, a, x, b), y, #node(#B, c, z, d))\n    };\n    case (#B, a, x, #node(#R, #node(#R, b, y, c), z, d)) {\n      #node(#R, #node(#B, a, x, b), y, #node(#B, c, z, d))\n    };\n    case (#B, a, x, #node(#R, b, y, #node(#R, c, z, d))) {\n      #node(#R, #node(#B, a, x, b), y, #node(#B, c, z, d))\n    };\n    case _ { #node(color, lt, kv, rt) };\n  }\n};\nfunc insertRoot<X, Y>(x : X, compareTo : (X, X) -> O.Order, y : Y, t : Tree<X, Y>)\n  : (?Y, Tree<X, Y>) {\n  switch (insertRec(x, compareTo, y, t)) {\n    case (_, #leaf) { assert false; loop { } };\n    case (yo, #node(_, l, xy, r)) { (yo, #node(#B, l, xy, r)) };\n  }\n};\nfunc insertRec<X, Y>(x : X, compareTo : (X, X) -> O.Order, y : Y, t : Tree<X, Y>)\n  : (?Y, Tree<X, Y>) {\n  switch t {\n    case (#leaf) { (null, #node(#R, #leaf, (x, ?y), #leaf)) };\n    case (#node(c, l, xy, r)) {\n      switch (compareTo(x, xy.0)) {\n        case (#less) {\n          let (yo, l2) = insertRec(x, compareTo, y, l);\n          (yo, bal(c, l2, xy, r))\n        };\n        case (#equal) {\n          (xy.1, #node(c, l, (x, ?y), r))\n        };\n        case (#greater) {\n          let (yo, r2) = insertRec(x, compareTo, y, r);\n          (yo, bal(c, l, xy, r2))\n        };\n      }\n    }\n  }\n};\nfunc getRec<X, Y>(x : X, compareTo : (X, X) -> O.Order, t : Tree<X, Y>) : ?Y {\n  switch t {\n    case (#leaf) { null };\n    case (#node(c, l, xy, r)) {\n      switch (compareTo(x, xy.0)) {\n        case (#less) { getRec(x, compareTo, l) };\n        case (#equal) { xy.1 };\n        case (#greater) { getRec(x, compareTo, r) };\n      }\n    };\n  }\n};\nfunc height<X, Y>(t : Tree<X, Y>) : Nat {\n  switch t {\n    case (#leaf) { 0 };\n    case (#node(_, l, _, r)) {\n      Nat.max(height(l), height(r)) + 1\n    }\n  }\n};","test":"import Debug \"mo:base/Debug\";\nimport Nat \"mo:base/Nat\";\nimport I \"mo:base/Iter\";\nimport List \"mo:base/List\";\nimport RBT \"mo:base/RBTree\";\n\nlet sorted =\n  [\n    (1, \"reformer\"),\n    (2, \"helper\"),\n    (3, \"achiever\"),\n    (4, \"individualist\"),\n    (5, \"investigator\"),\n    (6, \"loyalist\"),\n    (7, \"enthusiast\"),\n    (8, \"challenger\"),\n    (9, \"peacemaker\"),\n  ];\n\nlet unsort =\n  [\n    (6, \"loyalist\"),\n    (3, \"achiever\"),\n    (9, \"peacemaker\"),\n    (1, \"reformer\"),\n    (4, \"individualist\"),\n    (2, \"helper\"),\n    (8, \"challenger\"),\n    (5, \"investigator\"),\n    (7, \"enthusiast\"),\n  ];\n\nvar t = RBT.RBTree<Nat, Text>(Nat.compare);\n\nassert RBT.size(t.share()) == 0;\n\nfor ((num, lab) in unsort.vals()) {\n  Debug.print (Nat.toText num);\n  Debug.print lab;\n  t.put(num, lab);\n};\n\ndo { var i = 1;\nfor ((num, lab) in t.entries()) {\n  assert(num == i);\n i += 1;\n}};\n\nassert RBT.size(t.share()) == 9;\n\ndo { var i = 9;\nfor ((num, lab) in t.entriesRev()) {\n  assert(num == i);\n  i -= 1;\n}};\n\nassert RBT.size(t.share()) == 9;\n\nt.delete(5);\n\nassert RBT.size(t.share()) == 8;\n"}