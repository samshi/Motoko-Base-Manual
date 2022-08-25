modules.Option={"imports":{"Prelude":"P"},"functions":{"get":{"desc":"Unwraps an optional value, with a default value, i.e. `get(?x, d) = x` and\n`get(null, d) = d`.","body":"public func get<T>(x : ?T, default : T) : T =\n  switch x {\n    case null { default };\n    case (?x_) { x_ };\n  };"},"getMapped":{"desc":"// Unwraps an optional value using a function, or returns the default, i.e.\n`option(?x, f, d) = f x` and `option(null, f, d) = d`.","body":"public func getMapped<A, B>(x : ?A, f : A -> B, default : B) : B =\n  switch x {\n    case null { default };\n    case (?x_) { f(x_) };\n  };"},"map":{"desc":"// Applies a function to the wrapped value. `null`'s are left untouched.\n```motoko\nimport Option \"mo:base/Option\";\nassert Option.map<Nat, Nat>(?42, func x = x + 1) == ?43;\nassert Option.map<Nat, Nat>(null, func x = x + 1) == null;\n```","body":"public func map<A, B>(x : ?A, f : A -> B) : ?B =\n  switch x {\n    case null { null };\n    case (?x_) { ?f(x_) };\n  };"},"iterate":{"desc":"// Applies a function to the wrapped value, but discards the result. Use\n`iterate` if you're only interested in the side effect `f` produces.\n\n```motoko\nimport Option \"mo:base/Option\";\nvar counter : Nat = 0;\nOption.iterate(?5, func (x : Nat) { counter += x });\nassert counter == 5;\nOption.iterate(null, func (x : Nat) { counter += x });\nassert counter == 5;\n```","body":"public func iterate<A>(x : ?A, f : A -> ()) =\n  switch x {\n    case null {};\n    case (?x_) { f(x_) };\n  };"},"apply":{"desc":"// Applies an optional function to an optional value. Returns `null` if at\nleast one of the arguments is `null`.","body":"public func apply<A, B>(x : ?A, f : ?(A -> B)) : ?B {\n  switch (f, x) {\n    case (?f_, ?x_) {\n      ?f_(x_);\n    };\n    case (_, _) {\n      null;\n    };\n  };\n}"},"chain":{"desc":"Applies a function to an optional value. Returns `null` if the argument is\n`null`, or the function returns `null`.","body":"public func chain<A, B>(x : ?A, f : A -> ?B) : ?B {\n  switch(x) {\n    case (?x_) {\n      f(x_);\n    };\n    case (null) {\n      null;\n    };\n  };\n}"},"flatten":{"desc":"Given an optional optional value, removes one layer of optionality.\n```motoko\nimport Option \"mo:base/Option\";\nassert Option.flatten(?(?(42))) == ?42;\nassert Option.flatten(?(null)) == null;\nassert Option.flatten(null) == null;\n```","body":"public func flatten<A>(x : ??A) : ?A {\n  chain<?A, A>(x, func (x_ : ?A) : ?A {\n    x_;\n  });\n}"},"make":{"desc":"Creates an optional value from a definite value.\n```motoko\nimport Option \"mo:base/Option\";\nassert Option.make(42) == ?42;\n```","body":"public func make<A>(x: A) : ?A = ?x;"},"isSome":{"desc":"// Returns true if the argument is not `null`, otherwise returns false.","body":"public func isSome(x : ?Any) : Bool =\n  switch x {\n    case null { false };\n    case _ { true };\n  };"},"isNull":{"desc":"// Returns true if the argument is `null`, otherwise returns false.","body":"public func isNull(x : ?Any) : Bool =\n  switch x {\n    case null { true };\n    case _ { false };\n  };"},"assertSome":{"desc":"// Asserts that the value is not `null`; fails otherwise.\n@deprecated Option.assertSome will be removed soon; use an assert expression instead","body":"public func assertSome(x : ?Any) =\n  switch x {\n    case null { P.unreachable() };\n    case _ {};\n  };"},"assertNull":{"desc":"// Asserts that the value _is_ `null`; fails otherwise.\n@deprecated Option.assertNull will be removed soon; use an assert expression instead","body":"public func assertNull(x : ?Any) =\n  switch x {\n    case null { };\n    case _ { P.unreachable() };\n  };"},"unwrap":{"desc":"// Unwraps an optional value, i.e. `unwrap(?x) = x`.\n\n@deprecated Option.unwrap is unsafe and fails if the argument is null; it will be removed soon; use a `switch` or `do?` expression instead","body":"public func unwrap<T>(x : ?T) : T =\n  switch x {\n    case null { P.unreachable() };\n    case (?x_) { x_ };\n  };"}},"other":"","test":"import Option \"mo:base/Option\";\nimport Debug \"mo:base/Debug\";\n\nDebug.print(\"Option\");\n\ndo {\n  Debug.print(\"  apply\");\n\n  do {\n    Debug.print(\"    null function, null value\");\n\n    let actual = Option.apply<Int, Bool>(null, null);\n    let expected : ?Bool = null;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n    Debug.print(\"    null function, non-null value\");\n\n     let actual = Option.apply<Int, Bool>(?0, null);\n    let expected : ?Bool = null;\n\n     switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n    Debug.print(\"    non-null function, null value\");\n\n     let isEven = func (x : Int) : Bool {\n      x % 2 == 0;\n    };\n\n    let actual = Option.apply<Int, Bool>(null, ?isEven);\n    let expected : ?Bool = null;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n   Debug.print(\"    non-null function, non-null value\");\n\n   let isEven = func (x : Int) : Bool {\n      x % 2 == 0;\n    };\n\n    let actual = Option.apply<Int, Bool>(?0, ?isEven);\n    let expected = ?true;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(actual_ == expected_);\n      };\n      case (_, _) {\n        assert(false);\n      };\n    };\n  };\n\n };\n\ndo {\n  Debug.print(\"  bind\");\n\n  do {\n    Debug.print(\"    null value to null value\");\n\n    let safeInt = func (x : Int) : ?Int {\n      if (x > 9007199254740991) {\n        null;\n      } else {\n        ?x;\n      }\n    };\n\n    let actual = Option.chain<Int, Int>(null, safeInt);\n    let expected : ?Int = null;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n    Debug.print(\"    non-null value to null value\");\n\n    let safeInt = func (x : Int) : ?Int {\n      if (x > 9007199254740991) {\n        null;\n      } else {\n        ?x;\n      }\n    };\n\n    let actual = Option.chain<Int, Int>(?9007199254740992, safeInt);\n    let expected : ?Int = null;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n    Debug.print(\"    non-null value to non-null value\");\n\n    let safeInt = func (x : Int) : ?Int {\n      if (x > 9007199254740991) {\n        null;\n      } else {\n        ?x;\n      }\n    };\n\n    let actual = Option.chain<Int, Int>(?0, safeInt);\n    let expected = ?0;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(actual_ == expected_);\n      };\n      case (_, _) {\n        assert(false);\n      };\n    };\n  };\n\n};\n\ndo {\n  Debug.print(\"  flatten\");\n\n  do {\n    Debug.print(\"    null value\");\n\n    let actual = Option.flatten<Int>(?null);\n    let expected : ?Int = null;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n    Debug.print(\"    non-null value\");\n    let actual = Option.flatten<Int>(??0);\n    let expected = ?0;\n\n     switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(actual_ == expected_);\n      };\n      case (_, _) {\n        assert(false);\n      };\n    };\n  };\n\n};\n\ndo {\n  Debug.print(\"  map\");\n\n  do {\n    Debug.print(\"    null value\");\n\n    let isEven = func (x : Int) : Bool {\n      x % 2 == 0;\n    };\n\n    let actual = Option.map<Int, Bool>(null, isEven);\n    let expected : ?Bool = null;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(false);\n      };\n      case (_, _) {\n        assert(true);\n      };\n    };\n  };\n\n  do {\n    Debug.print(\"    non-null value\");\n\n    let isEven = func (x : Int) : Bool {\n      x % 2 == 0;\n    };\n\n    let actual = Option.map<Int, Bool>(?0, isEven);\n    let expected = ?true;\n\n    switch (actual, expected) {\n      case (?actual_, ?expected_) {\n        assert(actual_ == expected_);\n      };\n      case (_, _) {\n        assert(false);\n      };\n    };\n  };\n\n};\ndo {\n  Debug.print(\"  iterate\");\n\n  do {\n    var witness = 0;\n    Option.iterate<Nat>(?(1), func (x : Nat) { witness += 1; });\n    assert(witness == 1);\n    Option.iterate<Nat>(null, func (x : Nat) { witness += 1; });\n    assert(witness == 1);\n  };\n};\n\ndo {\n  Debug.print(\"  make\");\n\n  let actual = Option.make<Int>(0);\n  let expected = ?0;\n\n  switch (actual, expected) {\n    case (?actual_, ?expected_) {\n      assert(actual_ == expected_);\n    };\n    case (_, _) {\n      assert(false);\n    };\n  };\n};\n"}