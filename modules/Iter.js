modules.Iter={"imports":{"Array":"Array","Buffer":"Buffer","List":"List","Order":"Order"},"functions":{"Iter":{"desc":"An iterator that produces values of type `T`. Calling `next` returns\n`null` when iteration is finished.\n\nIterators are inherently stateful. Calling `next` \"consumes\" a value from\nthe Iterator that cannot be put back, so keep that in mind when sharing\niterators between consumers.\n\nAn iterater `i` can be iterated over using\n```\nfor (x in i) {\n  …do something with x…\n}\n```","body":"public type Iter<T> = { next : () -> ?T };"},"range":{"desc":"// Creates an iterator that produces all `Nat`s from `x` to `y` including\nboth of the bounds.\n```motoko\nimport Iter \"mo:base/Iter\";\nlet iter = Iter.range(1, 3);\nassert(?1 == iter.next());\nassert(?2 == iter.next());\nassert(?3 == iter.next());\nassert(null == iter.next());\n```","body":"public class range(x : Nat, y : Int) {\n  var i = x;\n  public func next() : ?Nat { if (i > y) { null } else {let j = i; i += 1; ?j} };\n}"},"revRange":{"desc":"Like `range` but produces the values in the opposite\norder.","body":"public class revRange(x : Int, y : Int) {\n    var i = x;\n    public func next() : ?Int { if (i < y) { null } else {let j = i; i -= 1; ?j} };\n}"},"iterate":{"desc":"Calls a function `f` on every value produced by an iterator and discards\nthe results. If you're looking to keep these results use `map` instead.\n\n```motoko\nimport Iter \"mo:base/Iter\";\nvar sum = 0;\nIter.iterate<Nat>(Iter.range(1, 3), func(x, _index) {\n  sum += x;\n});\nassert(6 == sum)\n```","body":"public func iterate<A>(\n  xs : Iter<A>,\n  f : (A, Nat) -> ()\n) {\n  var i = 0;\n  label l loop {\n    switch (xs.next()) {\n      case (?next) {\n        f(next, i);\n      };\n      case (null) {\n        break l;\n      };\n    };\n    i += 1;\n    continue l;\n  };\n}"},"size":{"desc":"Consumes an iterator and counts how many elements were produced\n(discarding them in the process).","body":"public func size<A>(xs : Iter<A>) : Nat {\n  var len = 0;\n  iterate<A>(xs, func (x, i) { len += 1; });\n  len;\n}"},"map":{"desc":"Takes a function and an iterator and returns a new iterator that lazily applies\nthe function to every element produced by the argument iterator.\n```motoko\nimport Iter \"mo:base/Iter\";\nlet iter = Iter.range(1, 3);\nlet mappedIter = Iter.map(iter, func (x : Nat) : Nat { x * 2 });\nassert(?2 == mappedIter.next());\nassert(?4 == mappedIter.next());\nassert(?6 == mappedIter.next());\nassert(null == mappedIter.next());\n```","body":"public func map<A, B>(xs : Iter<A>, f : A -> B) : Iter<B> = object {\n  public func next() : ?B {\n    switch (xs.next()) {\n      case (?next) {\n        ?f(next);\n      };\n      case (null) {\n        null;\n      };\n    };\n  };\n}"},"filter":{"desc":"Takes a function and an iterator and returns a new iterator that produces\nelements from the original iterator if and only if the predicate is true.\n```motoko\nimport Iter \"o:base/Iter\";\nlet iter = Iter.range(1, 3);\nlet mappedIter = Iter.filter(iter, func (x : Nat) : Bool { x % 2 == 1 });\nassert(?1 == mappedIter.next());\nassert(?3 == mappedIter.next());\nassert(null == mappedIter.next());\n```","body":"public func filter<A>(xs : Iter<A>, f : A -> Bool) : Iter<A> = object {\n  public func next() : ?A {\n    loop {\n      switch (xs.next()) {\n        case (null) {\n          return null;\n        };\n        case (?x) {\n          if (f(x)) {\n            return ?x;\n          };\n        };\n      };\n    };\n    null;\n  };\n}"},"make":{"desc":"Creates an iterator that produces an infinite sequence of `x`.\n```motoko\nimport Iter \"mo:base/Iter\";\nlet iter = Iter.make(10);\nassert(?10 == iter.next());\nassert(?10 == iter.next());\nassert(?10 == iter.next());\n// ...\n```","body":"public func make<A>(x : A) : Iter<A> = object {\n  public func next() : ?A {\n    ?x;\n  };\n}"},"fromArray":{"desc":"Creates an iterator that produces the elements of an Array in ascending index order.\n```motoko\nimport Iter \"mo:base/Iter\";\nlet iter = Iter.fromArray([1, 2, 3]);\nassert(?1 == iter.next());\nassert(?2 == iter.next());\nassert(?3 == iter.next());\nassert(null == iter.next());\n```","body":"public func fromArray<A>(xs : [A]) : Iter<A> {\n  var ix : Nat = 0;\n  let size = xs.size();\n  object {\n    public func next() : ?A {\n      if (ix >= size) {\n        return null\n      } else {\n        let res = ?(xs[ix]);\n        ix += 1;\n        return res\n      }\n    }\n  }\n}"},"fromArrayMut":{"desc":"Like `fromArray` but for Arrays with mutable elements. Captures\nthe elements of the Array at the time the iterator is created, so\nfurther modifications won't be reflected in the iterator.","body":"public func fromArrayMut<A>(xs : [var A]) : Iter<A> {\n  fromArray<A>(Array.freeze<A>(xs));\n}"},"fromList":{"desc":"Like `fromArray` but for Lists.","body":"public let fromList= List.toIter;"},"toArray":{"desc":"// Consumes an iterator and collects its produced elements in an Array.\n```motoko\nimport Iter \"mo:base/Iter\";\nlet iter = Iter.range(1, 3);\nassert([1, 2, 3] == Iter.toArray(iter));\n```","body":"public func toArray<A>(xs : Iter<A>) : [A] {\n  let buffer = Buffer.Buffer<A>(8);\n  iterate(xs, func(x : A, ix : Nat) { buffer.add(x) });\n  return buffer.toArray()\n}"},"toArrayMut":{"desc":"Like `toArray` but for Arrays with mutable elements.","body":"public func toArrayMut<A>(xs : Iter<A>) : [var A] {\n  Array.thaw<A>(toArray<A>(xs));\n}"},"toList":{"desc":"Like `toArray` but for Lists.","body":"public func toList<A>(xs : Iter<A>) : List.List<A> {\n  var result = List.nil<A>();\n  iterate<A>(xs, func (x, _i) {\n    result := List.push<A>(x, result);\n  });\n  List.reverse<A>(result);\n}"},"sort":{"desc":"Sorted iterator.  Will iterate over *all* elements to sort them, necessarily.","body":"public func sort<A>(xs : Iter<A>, compare : (A, A) -> Order.Order) : Iter<A> {\n  let a = toArrayMut<A>(xs);\n  Array.sortInPlace<A>(a, compare);\n  fromArrayMut<A>(a)\n}"}},"other":"","test":"import Iter \"mo:base/Iter\";\nimport Array \"mo:base/Array\";\nimport List \"mo:base/List\";\nimport Nat \"mo:base/Nat\";\nimport Int \"mo:base/Int\";\nimport Debug \"mo:base/Debug\";\n\nDebug.print(\"Iter\");\n\ndo {\n  Debug.print(\"  range\");\n\n  let tests = [((0,-1), \"\", \"0-1\"), ((0,0), \"0\", \"0\"), ((0, 5), \"012345\", \"\"), ((5, 0), \"\", \"543210\")];\n  for ((range, expected, revExpected) in tests.vals()) {\n      var x = \"\";\n      for (i in Iter.range(range)) {\n          x := x # Nat.toText(i);\n      };\n      assert(x == expected);\n      x := \"\";\n      for (i in Iter.revRange(range)) {\n          x := x # Int.toText(i);\n      };\n      assert(x == revExpected);\n  };\n};\n\ndo {\n  Debug.print(\"  iterate\");\n\n  let xs = [ \"a\", \"b\", \"c\", \"d\", \"e\", \"f\" ];\n\n  var y = \"\";\n  var z = 0;\n\n  Iter.iterate<Text>(xs.vals(), func (x : Text, i : Nat) {\n    y := y # x;\n    z += i;\n  });\n\n  assert(y == \"abcdef\");\n  assert(z == 15);\n};\n\ndo {\n  Debug.print(\"  map\");\n\n  let isEven = func (x : Int) : Bool {\n    x % 2 == 0;\n  };\n\n  let _actual = Iter.map<Nat, Bool>([ 1, 2, 3 ].vals(), isEven);\n  let actual = [var true, false, true];\n  Iter.iterate<Bool>(_actual, func (x, i) { actual[i] := x; });\n\n  let expected = [false, true, false];\n\n  for (i in actual.keys()) {\n    assert(actual[i] == expected[i]);\n  };\n};\n\ndo {\n  Debug.print(\"  filter\");\n\n  let isOdd = func (x : Int) : Bool {\n    x % 2 == 1;\n  };\n\n  let _actual = Iter.filter<Nat>([ 1, 2, 3 ].vals(), isOdd);\n  let actual = [var 0, 0];\n  Iter.iterate<Nat>(_actual, func (x, i) { actual[i] := x; });\n\n  let expected = [1, 3];\n\n  assert(Array.freeze(actual) == expected);\n};\n\ndo {\n  Debug.print(\"  make\");\n\n  let x = 1;\n  let y = Iter.make<Nat>(x);\n\n  switch (y.next()) {\n    case null { assert false; };\n    case (?z) { assert (x == z); };\n  };\n};\n\ndo {\n  Debug.print(\"  fromArray\");\n\n  let expected = [1, 2, 3];\n  let _actual = Iter.fromArray<Nat>(expected);\n  let actual = [var 0, 0, 0];\n\n  Iter.iterate<Nat>(_actual, func (x, i) { actual[i] := x; });\n\n  for (i in actual.keys()) {\n    assert(actual[i] == expected[i]);\n  };\n};\n\ndo {\n  Debug.print(\"  fromArrayMut\");\n\n  let expected = [var 1, 2, 3];\n  let _actual = Iter.fromArrayMut<Nat>(expected);\n  let actual = [var 0, 0, 0];\n\n  Iter.iterate<Nat>(_actual, func (x, i) { actual[i] := x; });\n\n  for (i in actual.keys()) {\n    assert(actual[i] == expected[i]);\n  };\n};\n\ndo {\n  Debug.print(\"  fromList\");\n\n  let list : List.List<Nat> = ?(1, ?(2, ?(3, List.nil<Nat>())));\n  let _actual = Iter.fromList<Nat>(list);\n  let actual = [var 0, 0, 0];\n  let expected = [1, 2, 3];\n\n  Iter.iterate<Nat>(_actual, func (x, i) { actual[i] := x; });\n\n  for (i in actual.keys()) {\n    assert(actual[i] == expected[i]);\n  };\n};\n\ndo {\n  Debug.print(\"  toArray\");\n\n  let expected = [1, 2, 3];\n  let actual = Iter.toArray<Nat>(expected.vals());\n\n  assert (actual.size() == expected.size());\n\n  for (i in actual.keys()) {\n    assert(actual[i] == expected[i]);\n  };\n};\n\ndo {\n  Debug.print(\"  toArrayMut\");\n\n  let expected = [var 1, 2, 3];\n  let actual = Iter.toArrayMut<Nat>(expected.vals());\n\n  assert (actual.size() == expected.size());\n\n  for (i in actual.keys()) {\n    assert(actual[i] == expected[i]);\n  };\n};\n\ndo {\n  Debug.print(\"  toList\");\n\n  let expected : List.List<Nat> = ?(1, ?(2, ?(3, List.nil<Nat>())));\n  let actual = Iter.toList<Nat>([1, 2, 3].vals());\n  assert List.equal<Nat>(expected, actual, func (x1, x2) { x1 == x2 });\n};\n\n\ndo {\n  Debug.print(\"  sort\");\n\n  let input : [Nat] = [4, 3, 1, 2, 5];\n  let expected : [Nat] = [1, 2, 3, 4, 5];\n  let actual = Iter.toArray(Iter.sort<Nat>(input.vals(), Nat.compare));\n  assert Array.equal<Nat>(expected, actual, func (x1, x2) { x1 == x2 });\n};\n"}