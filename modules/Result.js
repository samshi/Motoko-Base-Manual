modules.Result={"imports":{"mo:⛔":"Prim","Prelude":"P","Order":"Order"},"functions":{"equal":{"desc":"Compares two Result's for equality.","body":"public func equal<Ok, Err>(\n  eqOk : (Ok, Ok) -> Bool,\n  eqErr : (Err, Err) -> Bool,\n  r1 : Result<Ok, Err>,\n  r2 : Result<Ok, Err>\n) : Bool {\n  switch (r1, r2) {\n    case (#ok(ok1), #ok(ok2)) {\n      eqOk(ok1, ok2)\n    };\n    case (#err(err1), #err(err2)) {\n      eqErr(err1, err2);\n    };\n    case _ { false };\n  };\n}"},"compare":{"desc":"Compares two Results. `#ok` is larger than `#err`. This ordering is\narbitrary, but it lets you for example use Results as keys in ordered maps.","body":"public func compare<Ok, Err>(\n  compareOk : (Ok, Ok) -> Order.Order,\n  compareErr : (Err, Err) -> Order.Order,\n  r1 : Result<Ok, Err>,\n  r2 : Result<Ok, Err>\n) : Order.Order {\n  switch (r1, r2) {\n    case (#ok(ok1), #ok(ok2)) {\n      compareOk(ok1, ok2)\n    };\n    case (#err(err1), #err(err2)) {\n      compareErr(err1, err2)\n    };\n    case (#ok(_), _) { #greater };\n    case (#err(_), _) { #less };\n  };\n}"},"chain":{"desc":"Allows sequencing of `Result` values and functions that return\n`Result`'s themselves.\n```motoko\nimport Result \"mo:base/Result\";\ntype Result<T,E> = Result.Result<T, E>;\nfunc largerThan10(x : Nat) : Result<Nat, Text> =\n  if (x > 10) { #ok(x) } else { #err(\"Not larger than 10.\") };\n\nfunc smallerThan20(x : Nat) : Result<Nat, Text> =\n  if (x < 20) { #ok(x) } else { #err(\"Not smaller than 20.\") };\n\nfunc between10And20(x : Nat) : Result<Nat, Text> =\n  Result.chain(largerThan10(x), smallerThan20);\n\nassert(between10And20(15) == #ok(15));\nassert(between10And20(9) == #err(\"Not larger than 10.\"));\nassert(between10And20(21) == #err(\"Not smaller than 20.\"));\n```","body":"public func chain<R1, R2, Error>(\n  x : Result<R1, Error>,\n  y : R1 -> Result<R2, Error>\n) : Result<R2, Error> {\n  switch x {\n    case (#err(e)) { #err(e) };\n    case (#ok(r)) { y(r) };\n  }\n}"},"flatten":{"desc":"Flattens a nested Result.\n\n```motoko\nimport Result \"mo:base/Result\";\nassert(Result.flatten<Nat, Text>(#ok(#ok(10))) == #ok(10));\nassert(Result.flatten<Nat, Text>(#err(\"Wrong\")) == #err(\"Wrong\"));\nassert(Result.flatten<Nat, Text>(#ok(#err(\"Wrong\"))) == #err(\"Wrong\"));\n```","body":"public func flatten<Ok, Error>(\n  result : Result<Result<Ok, Error>, Error>\n) : Result<Ok, Error> {\n  switch result {\n    case (#ok(ok)) { ok };\n    case (#err(err)) { #err(err) };\n  }\n}"},"mapOk":{"desc":"Maps the `Ok` type/value, leaving any `Error` type/value unchanged.","body":"public func mapOk<Ok1, Ok2, Error>(\n  x : Result<Ok1, Error>,\n  f : Ok1 -> Ok2\n) : Result<Ok2, Error> {\n  switch x {\n    case (#err(e)) { #err(e) };\n    case (#ok(r)) { #ok(f(r)) };\n  }\n}"},"mapErr":{"desc":"Maps the `Err` type/value, leaving any `Ok` type/value unchanged.","body":"public func mapErr<Ok, Error1, Error2>(\n  x : Result<Ok, Error1>,\n  f : Error1 -> Error2\n) : Result<Ok, Error2> {\n  switch x {\n    case (#err(e)) { #err (f(e)) };\n    case (#ok(r)) { #ok(r) };\n  }\n}"},"fromOption":{"desc":"Create a result from an option, including an error value to handle the `null` case.\n```motoko\nimport Result \"mo:base/Result\";\nassert(Result.fromOption(?42, \"err\") == #ok(42));\nassert(Result.fromOption(null, \"err\") == #err(\"err\"));\n```","body":"public func fromOption<R, E>(x : ?R, err : E) : Result<R, E> {\n  switch x {\n    case (?x) { #ok(x) };\n    case null { #err(err) };\n  }\n}"},"toOption":{"desc":"Create an option from a result, turning all #err into `null`.\n```motoko\nimport Result \"mo:base/Result\";\nassert(Result.toOption(#ok(42)) == ?42);\nassert(Result.toOption(#err(\"err\")) == null);\n```","body":"public func toOption<R, E>(r : Result<R, E>) : ?R {\n  switch r {\n    case (#ok(x)) { ?x };\n    case (#err(_)) { null };\n  }\n}"},"iterate":{"desc":"Applies a function to a successful value, but discards the result. Use\n`iterate` if you're only interested in the side effect `f` produces.\n\n```motoko\nimport Result \"mo:base/Result\";\nvar counter : Nat = 0;\nResult.iterate<Nat, Text>(#ok(5), func (x : Nat) { counter += x });\nassert(counter == 5);\nResult.iterate<Nat, Text>(#err(\"Wrong\"), func (x : Nat) { counter += x });\nassert(counter == 5);\n```","body":"public func iterate<Ok, Err>(res : Result<Ok, Err>, f : Ok -> ()) {\n  switch res {\n    case (#ok(ok)) { f(ok) };\n    case _ {};\n  }\n}"},"isOk":{"desc":"Whether this Result is an `#ok`","body":"public func isOk(r : Result<Any, Any>) : Bool {\n  switch r {\n    case (#ok(_)) { true };\n    case (#err(_)) { false };\n  }\n}"},"isErr":{"desc":"Whether this Result is an `#err`","body":"public func isErr(r : Result<Any, Any>) : Bool {\n  switch r {\n    case (#ok(_)) { false };\n    case (#err(_)) { true };\n  }\n}"},"assertOk":{"desc":"Asserts that its argument is an `#ok` result, traps otherwise.","body":"public func assertOk(r : Result<Any,Any>) {\n  switch(r) {\n    case (#err(_)) { assert false };\n    case (#ok(_)) {};\n  }\n}"},"assertErr":{"desc":"Asserts that its argument is an `#err` result, traps otherwise.","body":"public func assertErr(r : Result<Any,Any>) {\n  switch(r) {\n    case (#err(_)) {};\n    case (#ok(_)) assert false;\n  }\n}"}},"other":"/// `Result<Ok, Err>` is the type used for returning and propagating errors. It\n/// is a type with the variants, `#ok(Ok)`, representing success and containing\n/// a value, and `#err(Err)`, representing error and containing an error value.\n/// The simplest way of working with `Result`s is to pattern match on them:\n/// For example, given a function `createUser(user : User) : Result<Id, String>`\n/// where `String` is an error message we could use it like so:\n/// ```motoko no-repl\n/// switch(createUser(myUser)) {\n///   case (#ok(id)) { Debug.print(\"Created new user with id: \" # id) };\n///   case (#err(msg)) { Debug.print(\"Failed to create user with the error: \" # msg) };\n/// }\n/// ```\npublic type Result<Ok, Err> = {\n  #ok : Ok;\n  #err : Err;\n};","test":"import Result \"mo:base/Result\";\nimport Int \"mo:base/Int\";\nimport Array \"mo:base/Array\";\nimport List \"mo:base/List\";\n\nimport Suite \"mo:matchers/Suite\";\nimport M \"mo:matchers/Matchers\";\nimport T \"mo:matchers/Testable\";\n\nfunc makeNatural(x : Int) : Result.Result<Nat, Text> =\n  if (x >= 0) { #ok(Int.abs(x)) } else { #err(Int.toText(x) # \" is not a natural number.\") };\n\nfunc largerThan10(x : Nat) : Result.Result<Nat, Text> =\n  if (x > 10) { #ok(x) } else { #err(Int.toText(x) # \" is not larger than 10.\") };\n\nlet chain = Suite.suite(\"chain\", [\n  Suite.test(\"ok -> ok\",\n    Result.chain<Nat, Nat, Text>(makeNatural(11), largerThan10),\n    M.equals(T.result<Nat,Text>(T.natTestable, T.textTestable, #ok(11)))\n  ),\n  Suite.test(\"ok -> err\",\n    Result.chain<Nat, Nat, Text>(makeNatural(5), largerThan10),\n    M.equals(T.result<Nat,Text>(T.natTestable, T.textTestable, #err(\"5 is not larger than 10.\")))\n  ),\n  Suite.test(\"err\",\n    Result.chain<Nat, Nat, Text>(makeNatural(-5), largerThan10),\n    M.equals(T.result<Nat,Text>(T.natTestable, T.textTestable, #err(\"-5 is not a natural number.\")))\n  ),\n]);\n\nlet flatten = Suite.suite(\"flatten\", [\n  Suite.test(\"ok -> ok\",\n    Result.flatten<Nat, Text>(#ok(#ok(10))),\n    M.equals(T.result<Nat,Text>(T.natTestable, T.textTestable, #ok(10)))\n  ),\n  Suite.test(\"err\",\n    Result.flatten<Nat, Text>(#err(\"wrong\")),\n    M.equals(T.result<Nat,Text>(T.natTestable, T.textTestable, #err(\"wrong\")))\n  ),\n  Suite.test(\"ok -> err\",\n    Result.flatten<Nat, Text>(#ok(#err(\"wrong\"))),\n    M.equals(T.result<Nat,Text>(T.natTestable, T.textTestable, #err(\"wrong\")))\n  ),\n]);\n\nlet iterate = Suite.suite(\"iterate\", do {\n  var tests : [Suite.Suite] = [];\n  var counter : Nat = 0;\n  Result.iterate(makeNatural(5), func (x : Nat) { counter += x });\n  tests := Array.append(tests, [Suite.test(\"ok\", counter, M.equals(T.nat(5)))]);\n  Result.iterate(makeNatural(-10), func (x : Nat) { counter += x });\n  tests := Array.append(tests, [Suite.test(\"err\", counter, M.equals(T.nat(5)))]);\n  tests\n});\n\nlet suite = Suite.suite(\"Result\", [\n  chain,\n  flatten,\n  iterate,\n]);\n\nSuite.run(suite);\n"}