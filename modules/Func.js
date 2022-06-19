modules.Func={"imports":{},"functions":{"compose":{"desc":"The composition of two functions `f` and `g` is a function that applies `g` and then `f`.\n\n```\ncompose(f, g)(x) = f(g(x))\n```","body":"public func compose<A, B, C>(f : B -> C, g : A -> B) : A -> C {\n  func (x : A) : C {\n    f(g(x));\n  };\n}"},"identity":{"desc":"The `identity` function returns its argument.\n```motoko\nimport Func \"mo:base/Func\";\nassert(Func.identity(10) == 10);\nassert(Func.identity(true) == true);\n``","body":"public func identity<A>(x : A) : A = x;"},"const":{"desc":"// The const function is a _curried_ function that accepts an argument `x`,\nand then returns a function that discards its argument and always returns\nthe `x`.\n\n```motoko\nimport Func \"mo:base/Func\";\nassert(Func.const<Nat, Text>(10)(\"hello\") == 10);\nassert(Func.const<Bool, Nat>(true)(20) == true);\n``","body":"public func const<A, B>(x : A) : B -> A =\n  func (_) = x;"}},"other":"","test":"import Function \"mo:base/Func\";\nimport Debug \"mo:base/Debug\";\nimport Text \"mo:base/Text\";\n\nDebug.print(\"Function\");\n\ndo {\n  Debug.print(\"  compose\");\n\n  func isEven(x : Int) : Bool { x % 2 == 0; };\n  func not_(x : Bool) : Bool { not x; };\n  let isOdd = Function.compose<Int, Bool, Bool>(not_, isEven);\n\n  assert(isOdd(0) == false);\n  assert(isOdd(1));\n};\n\ndo {\n  Debug.print(\"  const\");\n\n  assert(Function.const<Bool, Text>(true)(\"abc\"));\n  assert(Function.const<Bool, Text>(false)(\"abc\") == false);\n  assert(Function.const<Bool, (Text, Text)>(false)(\"abc\", \"abc\") == false);\n};\n"}