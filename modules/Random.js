modules.Random={"imports":{"Iter":"I","Option":"Option","Prelude":"P","mo:⛔":"Prim"},"functions":{"Finite":{"desc":"Drawing from a finite supply of entropy, `Finite` provides\nmethods to obtain random values. When the entropy is used up,\n`null` is returned. Otherwise the outcomes' distributions are\nstated for each method. The uniformity of outcomes is\nguaranteed only when the supplied entropy is originally obtained\nby the `blob()` call, and is never reused.","body":"public class Finite(entropy : Blob) {\n  let it : I.Iter<Nat8> = entropy.vals();\n\n  /// Uniformly distributes outcomes in the numeric range [0 .. 255].\n  /// Consumes 1 byte of entropy.\n  public func byte() : ?Nat8 {\n    it.next()\n  };\n\n  /// Bool iterator splitting up a byte of entropy into 8 bits\n  let bit : I.Iter<Bool> = object {\n    var mask = 0x80 : Nat8;\n    var byte = 0x00 : Nat8;\n    public func next() : ?Bool {\n      if (0 : Nat8 == mask) {\n        switch (it.next()) {\n          case null { null };\n          case (?w) {\n            byte := w;\n            mask := 0x40;\n            ?(0 : Nat8 != byte & (0x80 : Nat8))\n          }\n        }\n      } else {\n        let m = mask;\n        mask >>= (1 : Nat8);\n        ?(0 : Nat8 != byte & m)\n      }\n    }\n  };\n\n  /// Simulates a coin toss. Both outcomes have equal probability.\n  /// Consumes 1 bit of entropy (amortised).\n  public func coin() : ?Bool {\n    bit.next()\n  };\n\n  /// Uniformly distributes outcomes in the numeric range [0 .. 2^p - 1].\n  /// Consumes ⌈p/8⌉ bytes of entropy.\n  public func range(p : Nat8) : ?Nat {\n    var pp = p;\n    var acc : Nat = 0;\n    for (i in it) {\n      if (8 : Nat8 <= pp)\n      { acc := acc * 256 + Prim.nat8ToNat(i) }\n      else if (0 : Nat8 == pp)\n      { return ?acc }\n      else {\n        acc *= Prim.nat8ToNat(1 << pp);\n        let mask : Nat8 = 0xff >> (8 - pp);\n        return ?(acc + Prim.nat8ToNat(i & mask))\n      };\n      pp -= 8\n    };\n    null\n  };\n\n  /// Counts the number of heads in `n` fair coin tosses.\n  /// Consumes ⌈p/8⌉ bytes of entropy.\n  public func binomial(n : Nat8) : ?Nat8 {\n    var nn = n;\n    var acc : Nat8 = 0;\n    for (i in it) {\n      if (8 : Nat8 <= nn)\n      { acc +%= Prim.popcntNat8(i) }\n      else if (0 : Nat8 == nn)\n      { return ?acc }\n      else {\n        let mask : Nat8 = 0xff << (8 - nn);\n        let residue = Prim.popcntNat8(i & mask);\n        return ?(acc +% residue)\n      };\n      nn -= 8\n    };\n    null\n  }\n}"},"byteFrom":{"desc":"Distributes outcomes in the numeric range [0 .. 255].\nSeed blob must contain at least a byte.","body":"public func byteFrom(seed : Blob) : Nat8 {\n  switch (seed.vals().next()) {\n    case (?w) { w };\n    case _ { P.unreachable() };\n  }\n}"},"coinFrom":{"desc":"Simulates a coin toss.\nSeed blob must contain at least a byte.","body":"public func coinFrom(seed : Blob) : Bool {\n  switch (seed.vals().next()) {\n    case (?w) { w > (127 : Nat8) };\n    case _ { P.unreachable() };\n  }\n}"},"blob":{"desc":"Obtains a full blob (32 bytes) worth of fresh entropy.","body":"public let blob: shared () -> async Blob = raw_rand;"},"rangeFrom":{"desc":"// Distributes outcomes in the numeric range [0 .. 2^p - 1].\nSeed blob must contain at least ((p+7) / 8) bytes.","body":"public func rangeFrom(p : Nat8, seed : Blob) : Nat {\n  rangeIter(p, seed.vals())\n}"},"binomialFrom":{"desc":"Counts the number of heads in `n` coin tosses.\nSeed blob must contain at least ((n+7) / 8) bytes.","body":"public func binomialFrom(n : Nat8, seed : Blob) : Nat8 {\n  binomialIter(n, seed.vals())\n}"}},"other":"let raw_rand = (actor \"aaaaa-aa\" : actor { raw_rand : () -> async Blob }).raw_rand;\n// internal worker method, expects iterator with sufficient supply\nfunc rangeIter(p : Nat8, it : I.Iter<Nat8>) : Nat {\n  var pp = p;\n  var acc : Nat = 0;\n  for (i in it) {\n    if (8 : Nat8 <= pp)\n    { acc := acc * 256 + Prim.nat8ToNat(i) }\n    else if (0 : Nat8 == pp)\n    { return acc }\n    else {\n      acc *= Prim.nat8ToNat(1 << pp);\n      let mask : Nat8 = 0xff >> (8 - pp);\n      return acc + Prim.nat8ToNat(i & mask)\n    };\n    pp -= 8\n  };\n  P.unreachable()\n};\n// internal worker method, expects iterator with sufficient supply\nfunc binomialIter(n : Nat8, it : I.Iter<Nat8>) : Nat8 {\n  var nn = n;\n  var acc : Nat8 = 0;\n  for (i in it) {\n    if (8 : Nat8 <= nn)\n    { acc +%= Prim.popcntNat8(i) }\n    else if (0 : Nat8 == nn)\n    { return acc }\n    else {\n      let mask : Nat8 = 0xff << (8 - nn);\n      let residue = Prim.popcntNat8(i & mask);\n      return (acc +% residue)\n    };\n    nn -= 8\n  };\n  P.unreachable()\n}","test":""}