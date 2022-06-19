modules.Nat={"imports":{"Int":"Int","Order":"Order","mo:⛔":"Prim"},"functions":{"toText":{"desc":"Conversion","body":"public let toText : Nat -> Text = Int.toText;"},"min":{"desc":"// Returns the minimum of `x` and `y`.","body":"public func min(x : Nat, y : Nat) : Nat {\n  if (x < y) { x } else { y }\n}"},"max":{"desc":"Returns the maximum of `x` and `y`.","body":"public func max( x : Nat, y : Nat) : Nat {\n  if (x < y) { y } else { x }\n}"},"equal":{"desc":"Returns `x == y`","body":"public func equal(x : Nat, y : Nat) : Bool { x == y };"},"notEqual":{"desc":"// Returns `x != y`","body":"public func notEqual(x : Nat, y : Nat) : Bool { x != y };"},"less":{"desc":"// Returns `x < y`","body":"public func less(x : Nat, y : Nat) : Bool { x < y };"},"lessOrEqual":{"desc":"// Returns `x <= y`","body":"public func lessOrEqual(x : Nat, y : Nat) : Bool { x <= y };"},"greater":{"desc":"// Returns `x > y`","body":"public func greater(x : Nat, y : Nat) : Bool { x > y };"},"greaterOrEqual":{"desc":"// Returns `x >= y`","body":"public func greaterOrEqual(x : Nat, y : Nat) : Bool { x >= y };"},"compare":{"desc":"// Returns the order of `x` and `y`.","body":"public func compare(x : Nat, y : Nat) : { #less; #equal; #greater } {\n  if (x < y) { #less }\n  else if (x == y) { #equal }\n  else { #greater }\n}"},"add":{"desc":"Returns the sum of `x` and `y`, `x + y`","body":"public func add(x : Nat, y : Nat) : Nat { x + y };"},"sub":{"desc":"// Returns the difference of `x` and `y`, `x - y`.\nTraps on underflow","body":"public func sub(x : Nat, y : Nat) : Nat { x - y };"},"mul":{"desc":"// Returns the product of `x` and `y`, `x * y`","body":"public func mul(x : Nat, y : Nat) : Nat { x * y };"},"div":{"desc":"// Returns the division of `x` by `y`, `x / y`.\nTraps when `y` is zero","body":"public func div(x : Nat, y : Nat) : Nat { x / y };"},"rem":{"desc":"// Returns the remainder of `x` divided by `y`, `x % y`.\nTraps when `y` is zero","body":"public func rem(x : Nat, y : Nat) : Nat { x % y };"},"pow":{"desc":"// Returns `x` to the power of `y`, `x ** y`","body":"public func pow(x : Nat, y : Nat) : Nat { x ** y };"}},"other":"/// Infinite precision natural numbers.\npublic type Nat = Prim.Types.Nat;","test":"import Debug \"mo:base/Debug\";\nimport Nat \"mo:base/Nat\";\n\nDebug.print(\"Nat\");\n\ndo {\n  Debug.print(\"  add\");\n\n  assert(Nat.add(1, Nat.add(2, 3)) == Nat.add(1, Nat.add(2, 3)));\n  assert(Nat.add(0, 1) == 1);\n  assert(1 == Nat.add(1, 0));\n  assert(Nat.add(0, 1) == Nat.add(1, 0));\n  assert(Nat.add(1, 2) == Nat.add(2, 1));\n};\n\ndo {\n  Debug.print(\"  toText\");\n\n  assert(Nat.toText(0) == \"0\");\n  assert(Nat.toText(1234) == \"1234\");\n};\n"}