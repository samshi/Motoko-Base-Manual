modules.Int32={"imports":{"Int":"Int","mo:⛔":"Prim"},"functions":{"Int32":{"desc":"32-bit signed integers.","body":"public type Int32= Prim.Types.Int32;"},"toInt":{"desc":"// Conversion.","body":"public let toInt: Int32 -> Int = Prim.int32ToInt;"},"fromInt":{"desc":"// Conversion. Traps on overflow/underflow.","body":"public let fromInt: Int -> Int32  = Prim.intToInt32;"},"fromIntWrap":{"desc":"// Conversion. Wraps on overflow/underflow.","body":"public let fromIntWrap: Int -> Int32  = Prim.intToInt32Wrap;"},"fromNat32":{"desc":"// Conversion. Wraps on overflow/underflow.","body":"public let fromNat32: Nat32 -> Int32 = Prim.nat32ToInt32;"},"toNat32":{"desc":"// Conversion. Wraps on overflow/underflow.","body":"public let toNat32: Int32 -> Nat32  = Prim.int32ToNat32;"},"toText":{"desc":"// Returns the Text representation of `x`.","body":"public func toText(x : Int32) : Text {\n  Int.toText(toInt(x))\n}"},"abs":{"desc":"Returns the absolute value of `x`. Traps when `x = -2^31`.","body":"public func abs(x : Int32) : Int32 {\n  fromInt(Int.abs(toInt(x)))\n}"},"min":{"desc":"Returns the minimum of `x` and `y`.","body":"public func min(x : Int32, y : Int32) : Int32 {\n  if (x < y) { x } else { y }\n}"},"max":{"desc":"Returns the maximum of `x` and `y`.","body":"public func max( x : Int32, y : Int32) : Int32 {\n  if (x < y) { y } else { x }\n}"},"equal":{"desc":"Returns `x == y`.","body":"public func equal(x : Int32, y : Int32) : Bool { x == y };"},"notEqual":{"desc":"// Returns `x != y`.","body":"public func notEqual(x : Int32, y : Int32) : Bool { x != y };"},"less":{"desc":"// Returns `x < y`.","body":"public func less(x : Int32, y : Int32) : Bool { x < y };"},"lessOrEqual":{"desc":"// Returns `x <= y`.","body":"public func lessOrEqual(x : Int32, y : Int32) : Bool { x <= y };"},"greater":{"desc":"// Returns `x > y`.","body":"public func greater(x : Int32, y : Int32) : Bool { x > y };"},"greaterOrEqual":{"desc":"// Returns `x >= y`.","body":"public func greaterOrEqual(x : Int32, y : Int32) : Bool { x >= y };"},"compare":{"desc":"// Returns the order of `x` and `y`.","body":"public func compare(x : Int32, y : Int32) : { #less; #equal; #greater } {\n  if (x < y) { #less }\n  else if (x == y) { #equal }\n  else { #greater }\n}"},"neg":{"desc":"Returns the negation of `x`, `-x`. Traps on overflow.","body":"public func neg(x : Int32) : Int32 { -x; };"},"add":{"desc":"// Returns the sum of `x` and `y`, `x + y`. Traps on overflow.","body":"public func add(x : Int32, y : Int32) : Int32 { x + y };"},"sub":{"desc":"// Returns the difference of `x` and `y`, `x - y`. Traps on underflow.","body":"public func sub(x : Int32, y : Int32) : Int32 { x - y };"},"mul":{"desc":"// Returns the product of `x` and `y`, `x * y`. Traps on overflow.","body":"public func mul(x : Int32, y : Int32) : Int32 { x * y };"},"div":{"desc":"// Returns the division of `x by y`, `x / y`.\nTraps when `y` is zero.","body":"public func div(x : Int32, y : Int32) : Int32 { x / y };"},"rem":{"desc":"// Returns the remainder of `x` divided by `y`, `x % y`.\nTraps when `y` is zero.","body":"public func rem(x : Int32, y : Int32) : Int32 { x % y };"},"pow":{"desc":"// Returns `x` to the power of `y`, `x ** y`. Traps on overflow.","body":"public func pow(x : Int32, y : Int32) : Int32 { x ** y };"},"bitnot":{"desc":"// Returns the bitwise negation of `x`, `^x`.","body":"public func bitnot(x : Int32, y : Int32) : Int32 { ^x };"},"bitand":{"desc":"// Returns the bitwise and of `x` and `y`, `x & y`.","body":"public func bitand(x : Int32, y : Int32) : Int32 { x & y };"},"bitor":{"desc":"// Returns the bitwise or of `x` and `y`, `x \\| y`.","body":"public func bitor(x : Int32, y : Int32) : Int32 { x | y };"},"bitxor":{"desc":"// Returns the bitwise exclusive or of `x` and `y`, `x ^ y`.","body":"public func bitxor(x : Int32, y : Int32) : Int32 { x ^ y };"},"bitshiftLeft":{"desc":"// Returns the bitwise shift left of `x` by `y`, `x << y`.","body":"public func bitshiftLeft(x : Int32, y : Int32) : Int32 { x << y };"},"bitshiftRight":{"desc":"// Returns the bitwise shift right of `x` by `y`, `x >> y`.","body":"public func bitshiftRight(x : Int32, y : Int32) : Int32 { x >> y };"},"bitrotLeft":{"desc":"// Returns the bitwise rotate left of `x` by `y`, `x <<> y`.","body":"public func bitrotLeft(x : Int32, y : Int32) : Int32 { x <<> y };"},"bitrotRight":{"desc":"// Returns the bitwise rotate right of `x` by `y`, `x <>> y`.","body":"public func bitrotRight(x : Int32, y : Int32) : Int32 { x <>> y };"},"bittest":{"desc":"// Returns the value of bit `p mod 16` in `x`, `(x & 2^(p mod 16)) == 2^(p mod 16)`.","body":"public func bittest(x : Int32, p : Nat) : Bool {\n  Prim.btstInt32(x, Prim.intToInt32(p));\n}"},"bitset":{"desc":"Returns the value of setting bit `p mod 16` in `x` to `1`.","body":"public func bitset(x : Int32, p : Nat) : Int32 {\n  x | (1 << Prim.intToInt32(p));\n}"},"bitclear":{"desc":"Returns the value of clearing bit `p mod 16` in `x` to `0`.","body":"public func bitclear(x : Int32, p : Nat) : Int32 {\n  x & ^(1 << Prim.intToInt32(p));\n}"},"bitflip":{"desc":"Returns the value of flipping bit `p mod 16` in `x`.","body":"public func bitflip(x : Int32, p : Nat) : Int32 {\n  x ^ (1 << Prim.intToInt32(p));\n}"},"bitcountNonZero":{"desc":"Returns the count of non-zero bits in `x`.","body":"public let bitcountNonZero: (x : Int32) -> Int32 = Prim.popcntInt32;"},"bitcountLeadingZero":{"desc":"// Returns the count of leading zero bits in `x`.","body":"public let bitcountLeadingZero: (x : Int32) -> Int32 = Prim.clzInt32;"},"bitcountTrailingZero":{"desc":"// Returns the count of trailing zero bits in `x`.","body":"public let bitcountTrailingZero: (x : Int32) -> Int32 = Prim.ctzInt32;"},"addWrap":{"desc":"// Returns the sum of `x` and `y`, `x +% y`. Wraps on overflow.","body":"public func addWrap(x : Int32, y : Int32) : Int32 { x +% y };"},"subWrap":{"desc":"// Returns the difference of `x` and `y`, `x -% y`. Wraps on underflow.","body":"public func subWrap(x : Int32, y : Int32) : Int32 { x -% y };"},"mulWrap":{"desc":"// Returns the product of `x` and `y`, `x *% y`. Wraps on overflow.","body":"public func mulWrap(x : Int32, y : Int32) : Int32 { x *% y };"},"powWrap":{"desc":"// Returns `x` to the power of `y`, `x **% y`. Wraps on overflow. Traps if `y < 0`.","body":"public func powWrap(x : Int32, y : Int32) : Int32 { x **% y };"}},"related":"","test":""}