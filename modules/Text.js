modules.Text={"imports":{"Char":"Char","Iter":"Iter","Hash":"Hash","Stack":"Stack","mo:⛔":"Prim"},"functions":{"fromChar":{"desc":"Conversion.\nReturns the text value of size 1 containing the single character `c`","body":"public let fromChar : (c : Char) -> Text = Prim.charToText;"},"toIter":{"desc":"// Conversion.\nCreates an iterator that traverses the characters of the text `t`","body":"public func toIter(t : Text) : Iter.Iter<Char> =\n  t.chars();"},"fromIter":{"desc":"// Conversion.\nReturns the text value containing the sequence of characters in `cs`.","body":"public func fromIter(cs : Iter.Iter<Char>) : Text {\n  var r = \"\";\n  for (c in cs) {\n    r #= Prim.charToText(c);\n  };\n  return r;\n}"},"size":{"desc":"Returns `t.size()`, the number of characters in `t` (and `t.chars()`)","body":"public func size(t : Text) : Nat { t.size(); };"},"hash":{"desc":"// Returns a hash obtained by using the `djb2` algorithm from http://www.cse.yorku.ca/~oz/hash.html\n\nThis function is _good enough_ for use in a hash-table but it's not a cryptographic hash function!","body":"public func hash(t : Text) : Hash.Hash {\n  var x : Nat32 = 5381;\n  for (char in t.chars()) {\n    let c : Nat32 = Prim.charToNat32(char);\n    x := ((x << 5) +% x) +% c;\n  };\n  return x\n}"},"concat":{"desc":"Returns the concatenation of `t1` and `t2`, `t1 # t2`","body":"public func concat(t1 : Text, t2 : Text) : Text =\n  t1 # t2;"},"equal":{"desc":"// Returns `t1 == t2`","body":"public func equal(t1 : Text, t2 : Text) : Bool { t1 == t2 };"},"notEqual":{"desc":"// Returns `t1 != t2`","body":"public func notEqual(t1 : Text, t2 : Text) : Bool { t1 != t2 };"},"less":{"desc":"// Returns `t1 < t2`","body":"public func less(t1 : Text, t2 : Text) : Bool { t1 < t2 };"},"lessOrEqual":{"desc":"// Returns `t1 <= t2`","body":"public func lessOrEqual(t1 : Text, t2 : Text) : Bool { t1 <= t2 };"},"greater":{"desc":"// Returns `t1 > t2`","body":"public func greater(t1 : Text, t2 : Text) : Bool { t1 > t2 };"},"greaterOrEqual":{"desc":"// Returns `t1 >= t2`","body":"public func greaterOrEqual(t1 : Text, t2 : Text) : Bool { t1 >= t2 };"},"compare":{"desc":"// Returns the order of `t1` and `t2`.","body":"public func compare(t1 : Text, t2 : Text) : { #less; #equal; #greater } {\n  let c = Prim.textCompare(t1, t2);\n  if (c < 0) #less else if (c == 0) #equal else #greater\n}"},"join":{"desc":"Returns the concatenation of text values in `ts`, separated by `sep`.","body":"public func join(sep : Text, ts : Iter.Iter<Text>) : Text {\n  var r = \"\";\n  if (sep.size() == 0) {\n    for (t in ts) {\n      r #= t\n    };\n    return r;\n  };\n  let next = ts.next;\n  switch (next()) {\n    case null { return r; };\n    case (?t) {\n      r #= t;\n    }\n  };\n  loop {\n    switch (next()) {\n      case null { return r; };\n      case (?t) {\n        r #= sep;\n        r #= t;\n      }\n    }\n  }\n}"},"map":{"desc":"Returns the result of applying `f` to each character in `ts`, concatenating the intermediate single-character text values.","body":"public func map(t : Text, f : Char -> Char) : Text {\n  var r = \"\";\n  for (c in t.chars()) {\n    r #= Prim.charToText(f(c));\n  };\n  return r;\n}"},"translate":{"desc":"Returns the result of applying `f` to each character in `ts`, concatenating the intermediate text values.","body":"public func translate(t : Text, f : Char -> Text) : Text {\n  var r = \"\";\n  for (c in t.chars()) {\n    r #= f(c);\n  };\n  return r;\n}"},"split":{"desc":"Returns the sequence of fields in `t`, derived from start to end,\nseparated by text matching pattern `p`.\nTwo fields are separated by exactly one match.","body":"public func split(t : Text, p : Pattern) : Iter.Iter<Text> {\n  let match = matchOfPattern(p);\n  let cs = CharBuffer(t.chars());\n  var state = 0;\n  var field = \"\";\n  object {"},"tokens":{"desc":"Returns the sequence of tokens in `t`, derived from start to end.\nA _token_ is a non-empty maximal subsequence of `t` not containing a match for pattern `p`.\nTwo tokens may be separated by one or more matches of `p`.","body":"public func tokens(t : Text, p : Pattern) : Iter.Iter<Text> {\n  let fs = split(t, p);\n  object {"},"contains":{"desc":"Returns true if `t` contains a match for pattern `p`.","body":"public func contains(t : Text, p : Pattern) : Bool {\n  let match = matchOfPattern(p);\n  let cs = CharBuffer(t.chars());\n  loop {\n    switch (match(cs)) {\n      case (#success) {\n        return true\n      };\n      case (#empty(cs1)) {\n        return false;\n      };\n      case (#fail(cs1, c)) {\n        cs.pushBack(cs1, c);\n        switch (cs.next()) {\n          case null {\n            return false\n          };\n          case _ { }; // continue\n        }\n      }\n    }\n  }\n}"},"startsWith":{"desc":"Returns `true` if `t` starts with a prefix matching pattern `p`, otherwise returns `false`.","body":"public func startsWith(t : Text, p : Pattern) : Bool {\n  var cs = t.chars();\n  let match = matchOfPattern(p);\n  switch (match(cs)) {\n    case (#success) { true };\n    case _ { false };\n  }\n}"},"endsWith":{"desc":"Returns `true` if `t` ends with a suffix matching pattern `p`, otherwise returns `false`.","body":"public func endsWith(t : Text, p : Pattern) : Bool {\n  let s2 = sizeOfPattern(p);\n  if (s2 == 0) return true;\n  let s1 = t.size();\n  if (s2 > s1) return false;\n  let match = matchOfPattern(p);\n  var cs1 = t.chars();\n  var diff : Nat = s1 - s2;\n  while (diff > 0)  {\n    ignore cs1.next();\n    diff -= 1;\n  };\n  switch (match(cs1)) {\n    case (#success) { true };\n    case _ { false };\n  }\n}"},"replace":{"desc":"Returns `t` with all matches of pattern `p` replaced by text `r`.","body":"public func replace(t : Text, p : Pattern, r : Text) : Text {\n  let match = matchOfPattern(p);\n  let size = sizeOfPattern(p);\n  let cs = CharBuffer(t.chars());\n  var res = \"\";\n  label l\n  loop {\n    switch (match(cs)) {\n      case (#success) {\n        res #= r;\n        if (size > 0) {\n          continue l;\n        }\n      };\n      case (#empty(cs1)) {\n        for (c1 in cs1) {\n          res #= fromChar(c1);\n        };\n        break l;\n      };\n      case (#fail(cs1, c)) {\n        cs.pushBack(cs1, c);\n      }\n    };\n    switch (cs.next()) {\n      case null {\n        break l;\n      };\n      case (?c1) {\n       res #= fromChar(c1);\n      }; // continue\n    }\n  };\n  return res;\n}"},"stripStart":{"desc":"Returns the optioned suffix of `t` obtained by eliding exactly one leading match of pattern `p`, otherwise `null`.","body":"public func stripStart(t : Text, p : Pattern) : ?Text {\n  let s = sizeOfPattern(p);\n  if (s == 0) return ?t;\n  var cs = t.chars();\n  let match = matchOfPattern(p);\n  switch (match(cs)) {\n    case (#success) return ?fromIter(cs);\n    case _ return null;\n  }\n}"},"stripEnd":{"desc":"Returns the optioned prefix of `t` obtained by eliding exactly one trailing match of pattern `p`, otherwise `null`.","body":"public func stripEnd(t : Text, p : Pattern) : ?Text {\n  let s2 = sizeOfPattern(p);\n  if (s2 == 0) return ?t;\n  let s1 = t.size();\n  if (s2 > s1) return null;\n  let match = matchOfPattern(p);\n  var cs1 = t.chars();\n  var diff : Nat = s1 - s2;\n  while (diff > 0) {\n    ignore cs1.next();\n    diff -= 1;\n  };\n  switch (match(cs1)) {\n    case (#success) return ?extract(t, 0, s1 - s2);\n    case _ return null;\n  }\n}"},"trimStart":{"desc":"Returns the suffix of `t` obtained by eliding all leading matches of pattern `p`.","body":"public func trimStart(t : Text, p : Pattern) : Text {\n  let cs = t.chars();\n  let size = sizeOfPattern(p);\n  if (size == 0) return t;\n  var matchSize = 0;\n  let match = matchOfPattern(p);\n  loop {\n    switch (match(cs)) {\n      case (#success) {\n        matchSize += size;\n      }; // continue\n      case (#empty(cs1)) {\n        return if (matchSize == 0) {\n          t\n        } else {\n          fromIter(cs1)\n        }\n      };\n      case (#fail(cs1, c)) {\n        return if (matchSize == 0) {\n          t\n        } else {\n          fromIter(cs1) # fromChar(c) # fromIter(cs)\n        }\n      }\n    }\n  }\n}"},"trimEnd":{"desc":"Returns the prefix of `t` obtained by eliding all trailing matches of pattern `p`.","body":"public func trimEnd(t : Text, p : Pattern) : Text {\n  let cs = CharBuffer(t.chars());\n  let size = sizeOfPattern(p);\n  if (size == 0) return t;\n  let match = matchOfPattern(p);\n  var matchSize = 0;\n  label l\n  loop {\n    switch (match(cs)) {\n      case (#success) {\n        matchSize += size;\n      }; // continue\n      case (#empty(cs1)) {\n        switch (cs1.next()) {\n          case null break l;\n          case (?_) return t;\n        }\n      };\n      case (#fail(cs1, c)) {\n        matchSize := 0;\n        cs.pushBack(cs1, c);\n        ignore cs.next();\n      }\n    }\n  };\n  extract(t, 0, t.size() - matchSize)\n}"},"trim":{"desc":"Returns the subtext of `t` obtained by eliding all leading and trailing matches of pattern `p`.","body":"public func trim(t : Text, p : Pattern) : Text {\n  let cs = t.chars();\n  let size = sizeOfPattern(p);\n  if (size == 0) return t;\n  var matchSize = 0;\n  let match = matchOfPattern(p);\n  loop {\n    switch (match(cs)) {\n      case (#success) {\n        matchSize += size;\n      }; // continue\n      case (#empty(cs1)) {\n        return if (matchSize == 0) { t } else { fromIter(cs1) }\n      };\n      case (#fail(cs1, c)) {\n        let start = matchSize;\n        let cs2 = CharBuffer(cs);\n        cs2.pushBack(cs1, c);\n        ignore cs2.next();\n        matchSize := 0;\n        label l\n        loop {\n          switch (match(cs2)) {\n            case (#success) {\n              matchSize += size;\n            }; // continue\n            case (#empty(cs3)) {\n              switch (cs1.next()) {\n                case null break l;\n                case (?_) return t;\n              }\n            };\n            case (#fail(cs3, c1)) {\n              matchSize := 0;\n              cs2.pushBack(cs3, c1);\n              ignore cs2.next();\n            }\n          }\n        };\n        return extract(t, start, t.size() - matchSize - start);\n      }\n    }\n  }\n}"},"compareWith":{"desc":"Returns the lexicographic comparison of `t1` and `t2`, using the given character ordering `cmp`.","body":"public func compareWith(\n  t1 : Text,\n  t2 : Text,\n  cmp : (Char, Char)-> { #less; #equal; #greater })\n  : { #less; #equal; #greater } {\n  let cs1 = t1.chars();\n  let cs2 = t2.chars();\n  loop {\n    switch (cs1.next(), cs2.next()) {\n      case (null, null) { return #equal };\n      case (null, ?_) { return #less };\n      case (?_, null) { return #greater };\n      case (?c1, ?c2) {\n        switch (cmp(c1, c2)) {\n          case (#equal) { }; // continue\n          case other { return other; }\n        }\n      }\n    }\n  }\n}"},"encodeUtf8":{"desc":"Returns the UTF-8 encoding of the given tex","body":"public let encodeUtf8 : Text -> Blob = Prim.encodeUtf8;"},"decodeUtf8":{"desc":"// Tries to decode the given `Blob` as UTF-8.\nReturns `null` if the blob is _not_ valid UTF-8","body":"public let decodeUtf8 : Blob -> ?Text = Prim.decodeUtf8;"},"class.pushBack":{"desc":"","body":"public func pushBack(cs0: Iter.Iter<Char>, c : Char) {\n   stack.push((cs0, c));\n}"},"class.next":{"desc":"","body":"public func next() : ?Char {\n  switch (stack.peek()) {\n    case (?(buff, c)) {\n      switch (buff.next()) {\n        case null {\n          ignore stack.pop();\n          return ?c;\n        };\n        case oc {\n          return oc;\n        };\n      }\n    };\n    case null {\n      return cs.next();\n    };\n  };\n}"}},"other":"/// Text values.\npublic type Text = Prim.Types.Text;\nprivate func extract(t : Text, i : Nat, j : Nat) : Text {\n  let size = t.size();\n  if (i == 0 and j == size) return t;\n  assert (j <= size);\n  let cs = t.chars();\n  var r = \"\";\n  var n = i;\n  while (n > 0) {\n    ignore cs.next();\n    n -= 1;\n  };\n  n := j;\n  while (n > 0) {\n    switch (cs.next()) {\n      case null { assert false };\n      case (?c) { r #= Prim.charToText(c) }\n    };\n    n -= 1;\n  };\n  return r;\n};\n/// A pattern `p` describes a sequence of characters. A pattern has one of the following forms:\n/// * `#char c` matches the single character sequence, `c`.\n/// * `#predicate p` matches any single character sequence `c` satisfying predicate `p(c)`.\n/// * `#text t` matches multi-character text sequence `t`.\n/// A _match_ for `p` is any sequence of characters matching the pattern `p`.\npublic type Pattern = { #char : Char; #text : Text; #predicate : (Char -> Bool) };\nprivate func take(n : Nat, cs : Iter.Iter<Char>) : Iter.Iter<Char> {\n  var i = n;\n  object {\n    public func next() : ?Char {\n      if (i == 0) return null;\n      i -= 1;\n      return cs.next();\n    }\n  }\n};\nprivate func empty() : Iter.Iter<Char> {\n  object {\n    public func next() : ?Char = null;\n  };\n};\nprivate type Match = {\n  /// #success on complete match\n  #success;\n  /// #fail(cs,c) on partial match of cs, but failing match on c\n  #fail : (cs : Iter.Iter<Char>, c : Char);\n  /// #empty(cs) on partial match of cs and empty stream\n  #empty : (cs : Iter.Iter<Char> )\n};\nprivate func sizeOfPattern(pat : Pattern) : Nat {\n  switch pat {\n    case (#text(t)) { t.size() };\n    case (#predicate(_) or #char(_)) { 1 };\n  }\n};\nprivate func matchOfPattern(pat : Pattern) : (cs : Iter.Iter<Char>) -> Match {\n   switch pat {\n     case (#char(p)) {\n       func (cs : Iter.Iter<Char>) : Match {\n         switch (cs.next()) {\n           case (?c) {\n             if (p == c) {\n               #success\n             } else {\n               #fail(empty(), c) }\n             };\n           case null { #empty(empty()) };\n         }\n       }\n     };\n     case (#predicate(p)) {\n       func (cs : Iter.Iter<Char>) : Match {\n         switch (cs.next()) {\n           case (?c) {\n             if (p(c)) {\n               #success\n             } else {\n               #fail(empty(), c) }\n             };\n           case null { #empty(empty()) };\n         }\n       }\n     };\n     case (#text(p)) {\n       func (cs : Iter.Iter<Char>) : Match {\n         var i = 0;\n         let ds = p.chars();\n         loop {\n           switch (ds.next()) {\n             case (?d)  {\n               switch (cs.next()) {\n                 case (?c) {\n                   if (c != d) {\n                     return #fail(take(i, p.chars()), c)\n                   };\n                   i += 1;\n                 };\n                 case null {\n                   return #empty(take(i, p.chars()));\n                 }\n               }\n             };\n             case null { return #success };\n           }\n         }\n       }\n     }\n   }\n};\nprivate class CharBuffer(cs : Iter.Iter<Char>) : Iter.Iter<Char> = {\n  var stack : Stack.Stack<(Iter.Iter<Char>, Char)> = Stack.Stack();\n};\n/","test":"import Debug \"mo:base/Debug\";\nimport Text \"mo:base/Text\";\nimport Blob \"mo:base/Blob\";\nimport Iter \"mo:base/Iter\";\nimport Char \"mo:base/Char\";\nimport Order \"mo:base/Order\";\nimport Array \"mo:base/Array\";\nimport Nat32 \"mo:base/Nat32\";\n\nimport Suite \"mo:matchers/Suite\";\nimport M \"mo:matchers/Matchers\";\nimport T \"mo:matchers/Testable\";\n\nlet {run;test;suite} = Suite;\n\nfunc charT(c : Char): T.TestableItem<Char> = {\n  item = c;\n  display = Text.fromChar;\n  equals = Char.equal;\n};\n\nfunc blobT(b : Blob): T.TestableItem<Blob> = {\n  item = b;\n  display = func(b : Blob) : Text { debug_show(b) };\n  equals = Blob.equal;\n};\n\nfunc ordT(o : Order.Order): T.TestableItem<Order.Order> = {\n  item = o;\n  display = func (o : Order.Order) : Text { debug_show(o) };\n  equals = Order.equal;\n};\n\nfunc optTextT(ot : ?Text): T.TestableItem<?Text> = T.optional(T.textTestable, ot);\n\n// TODO: generalize and move to Iter.mo\nfunc iterT(c : [Char]): T.TestableItem<Iter.Iter<Char>> = {\n  item = c.vals();\n  display = Text.fromIter; // not this will only print the remainder of cs1 below\n  equals = func (cs1 : Iter.Iter<Char>, cs2 : Iter.Iter<Char>) : Bool {\n     loop {\n       switch (cs1.next(), cs2.next()) {\n         case (null,null) return true;\n         case (? c1, ? c2)\n           if (c1 != c2) return false;\n         case (_, _) return false;\n       }\n     }\n  };\n};\n\n// TODO: generalize and move to Iter.mo\nfunc textIterT(c : [Text]): T.TestableItem<Iter.Iter<Text>> = {\n  item = c.vals();\n  display = func (ts: Iter.Iter<Text>) : Text { Text.join(\",\", ts) };\n     // not this will only print the remainder of cs1 below\n  equals = func (ts1 : Iter.Iter<Text>, ts2 : Iter.Iter<Text>) : Bool {\n     loop {\n       switch (ts1.next(), ts2.next()) {\n         case (null,null) return true;\n         case (? t1, ? t2)\n           if (t1 != t2) return false;\n         case (_, _) return false;\n       }\n     }\n  };\n};\n\n\nrun(suite(\"size\",\n[\n test(\n   \"size-0\",\n   Text.size(\"\"),\n   M.equals(T.nat 0)),\n test(\n   \"size-1\",\n   Text.size(\"a\"),\n   M.equals(T.nat 1)),\n test(\n   \"size-2\",\n   Text.size(\"abcdefghijklmnopqrstuvwxyz\"),\n   M.equals(T.nat 26)),\n test(\n   \"size-3\",\n   Text.size(\"☃\"),\n   M.equals(T.nat 1)),\n test(\n   \"size-4\",\n   Text.size(\"☃☃\"),\n   M.equals(T.nat 2)),\n]));\n\n\n\nrun(suite(\"toIter\",\n[\n test(\n   \"toIter-0\",\n   Text.toIter(\"\"),\n   M.equals(iterT([]))),\n test(\n   \"toIter-1\",\n   Text.toIter(\"a\"),\n   M.equals(iterT (['a']))),\n test(\n   \"toIter-2\",\n   Text.toIter(\"abc\"),\n   M.equals(iterT (['a','b','c']))),\n do {\n   let a = Array.tabulate<Char>(1000, func i = Char.fromNat32(65+%Nat32.fromIntWrap(i % 26)));\n   test(\n     \"fromIter-2\",\n     Text.toIter(Text.join(\"\", Array.map(a, Char.toText).vals())),\n     M.equals(iterT a))\n },\n]));\n\nrun(suite(\"fromIter\",\n[\n test(\n   \"fromIter-0\",\n   Text.fromIter(([].vals())),\n   M.equals(T.text(\"\"))),\n test(\n   \"fromIter-1\",\n   Text.fromIter((['a'].vals())),\n   M.equals(T.text \"a\")),\n test(\n   \"fromIter-2\",\n   Text.fromIter((['a', 'b', 'c'].vals())),\n   M.equals(T.text \"abc\")),\n do {\n   let a = Array.tabulate<Char>(1000, func i = Char.fromNat32(65+%Nat32.fromIntWrap(i % 26)));\n   test(\n   \"fromIter-3\",\n   Text.fromIter(a.vals()),\n   M.equals(T.text (Text.join(\"\", Array.map(a, Char.toText).vals()))))\n },\n]));\n\n\nrun(suite(\"concat\",\n[\n test(\n   \"concat-0\",\n   Text.concat(\"\",\"\"),\n   M.equals(T.text(\"\"))),\n test(\n   \"concat-1\",\n   Text.concat(\"\",\"b\"),\n   M.equals(T.text \"b\")),\n test(\n   \"concat-2\",\n   Text.concat(\"a\",\"b\"),\n   M.equals(T.text \"ab\")),\n test(\n   \"concat-3\",\n   Text.concat(\"abcdefghijklmno\",\"pqrstuvwxyz\"),\n   M.equals(T.text \"abcdefghijklmnopqrstuvwxyz\")),\n]));\n\nrun(suite(\"join\",\n[\n test(\n   \"join-0\",\n   Text.join(\"\", ([\"\",\"\"].vals())),\n   M.equals(T.text(\"\"))),\n test(\n   \"join-1\",\n   Text.join(\"\", ([\"\",\"b\"].vals())),\n   M.equals(T.text \"b\")),\n test(\n   \"join-2\",\n   Text.join(\"\", ([\"a\",\"bb\",\"ccc\",\"dddd\"].vals())),\n   M.equals(T.text \"abbcccdddd\")),\n do {\n   let a = Array.tabulate<Char>(1000, func i = Char.fromNat32(65+%Nat32.fromIntWrap(i % 26)));\n   test(\n   \"join-3\",\n   Text.join(\"\", Array.map(a, Char.toText).vals()),\n   M.equals(T.text (Text.fromIter(a.vals()))))\n },\n test(\n   \"join-4\",\n   Text.join(\"\", ([].vals())),\n   M.equals(T.text \"\")),\n test(\n   \"join-5\",\n   Text.join(\"\", ([\"aaa\"].vals())),\n   M.equals(T.text \"aaa\")),\n]));\n\nrun(suite(\"join\",\n[\n test(\n   \"join-0\",\n   Text.join(\",\", ([\"\",\"\"].vals())),\n   M.equals(T.text(\",\"))),\n test(\n   \"join-1\",\n   Text.join(\",\", ([\"\",\"b\"].vals())),\n   M.equals(T.text \",b\")),\n test(\n   \"join-2\",\n   Text.join(\",\", ([\"a\",\"bb\",\"ccc\",\"dddd\"].vals())),\n   M.equals(T.text \"a,bb,ccc,dddd\")),\n do {\n   let a = Array.tabulate<Char>(1000, func i = Char.fromNat32(65+%Nat32.fromIntWrap(i % 26)));\n   test(\n   \"join-3\",\n   Text.join(\"\", Array.map(a, Char.toText).vals()),\n   M.equals(T.text (Text.fromIter(a.vals()))))\n  },\n test(\n   \"join-4\",\n   Text.join(\",\", ([].vals())),\n   M.equals(T.text \"\")),\n test(\n   \"join-5\",\n   Text.join(\",\", ([\"aaa\"].vals())),\n   M.equals(T.text \"aaa\")),\n]));\n\n\nrun(suite(\"split\",\n[\n test(\n   \"split-char-empty\",\n   Text.split(\"\", #char ';'),\n   M.equals(textIterT([]))),\n test(\n   \"split-char-none\",\n   Text.split(\"abc\", #char ';'),\n   M.equals(textIterT([\"abc\"]))),\n test(\n   \"split-char-empties2\",\n   Text.split(\";\", #char ';'),\n   M.equals(textIterT([\"\",\"\"]))),\n test(\n   \"split-char-empties3\",\n   Text.split(\";;\", #char ';'),\n   M.equals(textIterT([\"\",\"\",\"\"]))),\n test(\n   \"split-char-singles\",\n   Text.split(\"a;b;;c;;;d\", #char ';'),\n   M.equals(textIterT([\"a\",\"b\",\"\",\"c\",\"\",\"\",\"d\"]))),\n test(\n   \"split-char-mixed\",\n   Text.split(\"a;;;ab;;abc;\", #char ';'),\n   M.equals(textIterT([\"a\",\"\",\"\",\"ab\",\"\",\"abc\",\"\"]))),\n do {\n   let a = Array.tabulate<Text>(1000,func _ = \"abc\");\n   let t = Text.join(\";\", a.vals());\n   test(\n     \"split-char-large\",\n     Text.split(t, #char ';'),\n     M.equals(textIterT a))\n },\n do {\n   let a = Array.tabulate<Text>(100000,func _ = \"abc\");\n   let t = Text.join(\";\", a.vals());\n   test(\n     \"split-char-very-large\",\n     Text.split(t, #char ';'),\n     M.equals(textIterT a))\n },\n]));\n\n\ndo {\nlet pat : Text.Pattern = #predicate (func (c : Char) : Bool { c == ';' or c == '!' }) ;\nrun(suite(\"split\",\n[\n test(\n   \"split-pred-empty\",\n   Text.split(\"\", pat),\n   M.equals(textIterT([]))),\n test(\n   \"split-pred-none\",\n   Text.split(\"abc\", pat),\n   M.equals(textIterT([\"abc\"]))),\n test(\n   \"split-pred-empties2\",\n   Text.split(\";\", pat),\n   M.equals(textIterT([\"\",\"\"]))),\n test(\n   \"split-pred-empties3\",\n   Text.split(\";!\", pat),\n   M.equals(textIterT([\"\",\"\",\"\"]))),\n test(\n   \"split-pred-singles\",\n   Text.split(\"a;b;!c!;;d\", pat),\n   M.equals(textIterT([\"a\",\"b\",\"\",\"c\",\"\",\"\",\"d\"]))),\n test(\n   \"split-pred-mixed\",\n   Text.split(\"a;!;ab;!abc;\", pat),\n   M.equals(textIterT([\"a\",\"\",\"\",\"ab\",\"\",\"abc\",\"\"]))),\n do {\n   let a = Array.tabulate<Text>(1000,func _ = \"abc\");\n   let t = Text.join(\";\", a.vals());\n   test(\n     \"split-pred-large\",\n     Text.split(t, pat),\n     M.equals(textIterT a))\n },\n do {\n   let a = Array.tabulate<Text>(10000,func _ = \"abc\");\n   let t = Text.join(\";\", a.vals());\n   test(\n     \"split-pred-very-large\",\n     Text.split(t, pat),\n     M.equals(textIterT a))\n },\n]))\n};\n\n\ndo {\nlet pat : Text.Pattern = #text \"PAT\" ;\nrun(suite(\"split\",\n[\n test(\n   \"split-pat-empty\",\n   Text.split(\"\", pat),\n   M.equals(textIterT([]))),\n test(\n   \"split-pat-none\",\n   Text.split(\"abc\", pat),\n   M.equals(textIterT([\"abc\"]))),\n test(\n   \"split-pat-empties2\",\n   Text.split(\"PAT\", pat),\n   M.equals(textIterT([\"\",\"\"]))),\n test(\n   \"split-pat-empties3\",\n   Text.split(\"PATPAT\", pat),\n   M.equals(textIterT([\"\",\"\",\"\"]))),\n test(\n   \"split-pat-singles\",\n   Text.split(\"aPATbPATPATcPATPATPATd\", pat),\n   M.equals(textIterT([\"a\",\"b\",\"\",\"c\",\"\",\"\",\"d\"]))),\n test(\n   \"split-pat-mixed\",\n   Text.split(\"aPATPATPATabPATPATabcPAT\", pat),\n   M.equals(textIterT([\"a\",\"\",\"\",\"ab\",\"\",\"abc\",\"\"]))),\n do {\n   let a = Array.tabulate<Text>(1000,func _ = \"abc\");\n   let t = Text.join(\"PAT\", a.vals());\n   test(\n     \"split-pat-large\",\n     Text.split(t, pat),\n     M.equals(textIterT a))\n },\n do {\n   let a = Array.tabulate<Text>(10000,func _ = \"abc\");\n   let t = Text.join(\"PAT\", a.vals());\n   test(\n     \"split-pat-very-large\",\n     Text.split(t, pat),\n     M.equals(textIterT a))\n },\n]))\n};\n\n\nrun(suite(\"tokens\",\n[\n test(\n   \"tokens-char-empty\",\n   Text.tokens(\"\", #char ';'),\n   M.equals(textIterT([]))),\n test(\n   \"tokens-char-none\",\n   Text.tokens(\"abc\", #char ';'),\n   M.equals(textIterT([\"abc\"]))),\n test(\n   \"tokens-char-empties2\",\n   Text.tokens(\";\", #char ';'),\n   M.equals(textIterT([]))),\n test(\n   \"tokens-char-empties3\",\n   Text.tokens(\";;\", #char ';'),\n   M.equals(textIterT([]))),\n test(\n   \"tokens-char-singles\",\n   Text.tokens(\"a;b;;c;;;d\", #char ';'),\n   M.equals(textIterT([\"a\",\"b\",\"c\",\"d\"]))),\n test(\n   \"tokens-char-mixed\",\n   Text.tokens(\"a;;;ab;;abc;\", #char ';'),\n   M.equals(textIterT([\"a\",\"ab\",\"abc\"]))),\n do {\n   let a = Array.tabulate<Text>(1000,func _ = \"abc\");\n   let t = Text.join(\";;\", a.vals());\n   test(\n     \"tokens-char-large\",\n     Text.tokens(t, #char ';'),\n     M.equals(textIterT a))\n },\n do {\n   let a = Array.tabulate<Text>(100000,func _ = \"abc\");\n   let t = Text.join(\";;\", a.vals());\n   test(\n     \"tokens-char-very-large\",\n     Text.tokens(t, #char ';'),\n     M.equals(textIterT a))\n },\n]));\n\nrun(suite(\"startsWith\",\n[\n test(\n   \"startsWith-both-empty\",\n   Text.startsWith(\"\", #text \"\"),\n   M.equals(T.bool true)),\n test(\n   \"startsWith-empty-text\",\n   Text.startsWith(\"\", #text \"abc\"),\n   M.equals(T.bool false)),\n test(\n   \"startsWith-empty-pat\",\n   Text.startsWith(\"abc\", #text \"\"),\n   M.equals(T.bool true)),\n test(\n   \"startsWith-1\",\n   Text.startsWith(\"a\", #text \"b\"),\n   M.equals(T.bool false)),\n test(\n   \"startsWith-2\",\n   Text.startsWith(\"abc\", #text \"abc\"),\n   M.equals(T.bool true)),\n test(\n   \"startsWith-3\",\n   Text.startsWith(\"abcd\", #text \"ab\"),\n   M.equals(T.bool true)),\n test(\n   \"startsWith-4\",\n   Text.startsWith(\"abcdefghijklmnopqrstuvwxyz\",#text \"abcdefghijklmno\"),\n   M.equals(T.bool true)),\n]));\n\n\n\nrun(suite(\"endsWith\",\n[\n test(\n   \"endsWith-both-empty\",\n   Text.endsWith(\"\", #text \"\"),\n   M.equals(T.bool true)),\n test(\n   \"endsWith-empty-text\",\n   Text.endsWith(\"\", #text \"abc\"),\n   M.equals(T.bool false)),\n test(\n   \"endsWith-empty-pat\",\n   Text.endsWith(\"abc\", #text \"\"),\n   M.equals(T.bool true)),\n test(\n   \"endsWith-1\",\n   Text.endsWith(\"a\", #text \"b\"),\n   M.equals(T.bool false)),\n test(\n   \"endsWith-2\",\n   Text.endsWith(\"abc\", #text \"abc\"),\n   M.equals(T.bool true)),\n test(\n   \"endsWith-3\",\n   Text.endsWith(\"abcd\", #text \"cd\"),\n   M.equals(T.bool true)),\n test(\n   \"endsWith-4\",\n   Text.endsWith(\"abcdefghijklmnopqrstuvwxyz\",#text \"pqrstuvwxyz\"),\n   M.equals(T.bool true)),\n]));\n\n\nrun(suite(\"contains\",\n[\n test(\n   \"contains-start\",\n   Text.contains(\"abcd\", #text \"ab\"),\n   M.equals(T.bool true)),\n test(\n   \"contains-empty\",\n   Text.contains(\"abc\", #text \"\"),\n   M.equals(T.bool true)),\n test(\n   \"contains-false\",\n   Text.contains(\"ab\", #text \"bc\" ),\n   M.equals(T.bool false)),\n test(\n   \"contains-exact\",\n   Text.contains(\"abc\", #text \"abc\"),\n   M.equals(T.bool true)),\n test(\n   \"contains-within\",\n   Text.contains(\"abcdefghijklmnopqrstuvwxyz\", #text \"qrst\"),\n   M.equals(T.bool true)),\n test(\n   \"contains-front\",\n   Text.contains(\"abcdefghijklmnopqrstuvwxyz\", #text \"abcdefg\"),\n   M.equals(T.bool true)),\n test(\n   \"contains-end\",\n   Text.contains(\"abcdefghijklmnopqrstuvwxyz\", #text \"xyz\"),\n   M.equals(T.bool true)),\n test(\n   \"contains-false\",\n   Text.contains(\"abcdefghijklmnopqrstuvwxyz\", #text \"lkj\"),\n   M.equals(T.bool false)),\n test(\n   \"contains-empty-nonempty\",\n   Text.contains(\"\", #text \"xyz\"),\n   M.equals(T.bool false)),\n]));\n\n\nrun(suite(\"replace\",\n[\n test(\n   \"replace-start\",\n   Text.replace(\"abcd\", #text \"ab\", \"AB\"),\n   M.equals(T.text \"ABcd\")),\n test(\n   \"replace-empty\",\n   Text.replace(\"abc\", #text \"\", \"AB\"),\n   M.equals(T.text \"ABaABbABcAB\")),\n test(\n   \"replace-none\",\n   Text.replace(\"ab\", #text \"bc\", \"AB\"),\n   M.equals(T.text \"ab\")),\n test(\n   \"replace-exact\",\n   Text.replace(\"ab\", #text \"ab\", \"AB\"),\n   M.equals(T.text \"AB\")),\n test(\n   \"replace-several\",\n   Text.replace(\"abcdabghijabmnopqrstuabwxab\", #text \"ab\", \"AB\"),\n   M.equals(T.text \"ABcdABghijABmnopqrstuABwxAB\")),\n test(\n   \"replace-delete\",\n   Text.replace(\"abcdabghijabmnopqrstuabwxab\", #text \"ab\", \"\"),\n   M.equals(T.text \"cdghijmnopqrstuwx\")),\n test(\n   \"replace-pred\",\n   Text.replace(\"abcdefghijklmnopqrstuvwxyz\", #predicate (func (c : Char) : Bool { c < 'm'}), \"\"),\n   M.equals(T.text \"mnopqrstuvwxyz\")),\n test(\n  \"replace-partial\",\n  Text.replace(\"123\", #text \"124\", \"ABC\"),\n   M.equals(T.text \"123\")),\n test(\n  \"replace-partial-2\",\n  Text.replace(\"12341235124\", #text \"124\", \"ABC\"),\n   M.equals(T.text \"12341235ABC\")),\n test(\n  \"replace-partial-3\",\n  Text.replace(\"111234123511124\", #text \"124\", \"ABC\"),\n   M.equals(T.text \"111234123511ABC\")),\n]));\n\nrun(suite(\"stripStart\",\n[\n test(\n   \"stripStart-none\",\n   Text.stripStart(\"cd\", #text \"ab\"),\n   M.equals(optTextT (null))),\n test(\n   \"stripStart-one\",\n   Text.stripStart(\"abcd\", #text \"ab\"),\n   M.equals(optTextT (?\"cd\"))),\n test(\n   \"stripStart-two\",\n   Text.stripStart(\"abababcd\", #text \"ab\", ),\n   M.equals(optTextT (?\"ababcd\"))),\n test(\n   \"stripStart-only\",\n   Text.stripStart(\"ababababab\", #text \"ab\", ),\n   M.equals(optTextT (?\"abababab\"))),\n test(\n   \"stripStart-empty\",\n   Text.stripStart(\"abcdef\", #text \"\"),\n   M.equals(optTextT(?\"abcdef\"))),\n test(\n   \"stripStart-tooshort\",\n   Text.stripStart(\"abcdef\", #text \"abcdefg\"),\n   M.equals(optTextT(null))),\n]));\n\n\nrun(suite(\"stripEnd\",\n[\n test(\n   \"stripEnd-exact\",\n   Text.stripEnd(\"cd\", #text \"cd\"),\n   M.equals(optTextT (?\"\"))),\n test(\n   \"stripEnd-one\",\n   Text.stripEnd(\"abcd\", #text \"cd\"),\n   M.equals(optTextT (?\"ab\"))),\n test(\n   \"stripEnd-three\",\n   Text.stripEnd(\"abcdcdcd\", #text \"cd\", ),\n   M.equals(optTextT (?\"abcdcd\"))),\n test(\n   \"stripEnd-many\",\n   Text.stripEnd(\"cdcdcdcdcdcdcd\", #text \"cd\", ),\n   M.equals(optTextT (?\"cdcdcdcdcdcd\"))),\n test(\n   \"stripEnd-empty-pat\",\n   Text.stripEnd(\"abcdef\", #text \"\"),\n   M.equals(optTextT (?\"abcdef\"))),\n test(\n   \"stripEnd-empty\",\n   Text.stripEnd(\"\", #text \"cd\"),\n   M.equals(optTextT null)),\n test(\n   \"stripEnd-tooshort\",\n   Text.stripEnd(\"bcdef\", #text \"abcdef\"),\n   M.equals(optTextT null)),\n]));\n\n\nrun(suite(\"trimStart\",\n[\n test(\n   \"trimStart-none\",\n   Text.trimStart(\"cd\", #text \"ab\"),\n   M.equals(T.text \"cd\")),\n test(\n   \"trimStart-one\",\n   Text.trimStart(\"abcd\", #text \"ab\"),\n   M.equals(T.text \"cd\")),\n test(\n   \"trimStart-two\",\n   Text.trimStart(\"abababcd\", #text \"ab\", ),\n   M.equals(T.text \"cd\")),\n test(\n   \"trimStart-only\",\n   Text.trimStart(\"ababababab\", #text \"ab\", ),\n   M.equals(T.text \"\")),\n test(\n   \"trimStart-empty\",\n   Text.trimStart(\"abcdef\", #text \"\"),\n   M.equals(T.text \"abcdef\")),\n]));\n\nrun(suite(\"trimEnd\",\n[\n test(\n   \"trimEnd-exact\",\n   Text.trimEnd(\"cd\", #text \"cd\"),\n   M.equals(T.text \"\")),\n test(\n   \"trimEnd-one\",\n   Text.trimEnd(\"abcd\", #text \"cd\"),\n   M.equals(T.text \"ab\")),\n test(\n   \"trimEnd-three\",\n   Text.trimEnd(\"abcdcdcd\", #text \"cd\", ),\n   M.equals(T.text \"ab\")),\n test(\n   \"trimEnd-many\",\n   Text.trimEnd(\"cdcdcdcdcdcdcd\", #text \"cd\", ),\n   M.equals(T.text \"\")),\n test(\n   \"trimEnd-empty-pat\",\n   Text.trimEnd(\"abcdef\", #text \"\"),\n   M.equals(T.text \"abcdef\")),\n test(\n   \"trimEnd-empty\",\n   Text.trimEnd(\"\", #text \"cd\"),\n   M.equals(T.text \"\")),\n]));\n\nrun(suite(\"trim\",\n[\n test(\n   \"trim-exact\",\n   Text.trim(\"cd\", #text \"cd\"),\n   M.equals(T.text \"\")),\n test(\n   \"trim-one\",\n   Text.trim(\"cdabcd\", #text \"cd\"),\n   M.equals(T.text \"ab\")),\n  test(\n   \"trim-three\",\n   Text.trim(\"cdcdcdabcdcdcd\", #text \"cd\", ),\n   M.equals(T.text \"ab\")),\n test(\n   \"trim-many\",\n   Text.trim(\"cdcdcdcdcdcdcd\", #text \"cd\", ),\n   M.equals(T.text \"\")),\n test(\n   \"trim-empty-pat\",\n   Text.trim(\"abcdef\", #text \"\"),\n   M.equals(T.text \"abcdef\")),\n test(\n   \"trim-empty\",\n   Text.trim(\"\", #text \"cd\"),\n   M.equals(T.text \"\")),\n]));\n\nrun(suite(\"compare\",\n[\n test(\n   \"compare-empties\",\n   Text.compare(\"\", \"\"),\n   M.equals(ordT (#equal))),\n test(\n   \"compare-empty-nonempty\",\n   Text.compare(\"\", \"a\"),\n   M.equals(ordT (#less))),\n test(\n   \"compare-nonempty-empty\",\n   Text.compare(\"a\", \"\"),\n   M.equals(ordT (#greater))),\n test(\n   \"compare-a-a\",\n   Text.compare(\"a\", \"a\"),\n   M.equals(ordT (#equal))),\n test(\n   \"compare-a-b\",\n   Text.compare(\"a\", \"b\"),\n   M.equals(ordT (#less))),\n test(\n   \"compare-b-a\",\n   Text.compare(\"b\", \"a\"),\n   M.equals(ordT (#greater)))\n]));\n\ndo {\nlet cmp = Char.compare;\nrun(suite(\"compareWith\",\n[\n test(\n   \"compareWith-empties\",\n   Text.compareWith(\"\", \"\", cmp),\n   M.equals(ordT (#equal))),\n test(\n   \"compareWith-empty\",\n   Text.compareWith(\"abc\", \"\", cmp),\n   M.equals(ordT (#greater))),\n test(\n   \"compareWith-equal-nonempty\",\n   Text.compareWith(\"abc\", \"abc\", cmp ),\n   M.equals(ordT (#equal))),\n test(\n   \"compareWith-less-nonempty\",\n   Text.compareWith(\"abc\", \"abd\", cmp),\n   M.equals(ordT (#less))),\n test(\n   \"compareWith-less-nonprefix\",\n   Text.compareWith(\"abc\", \"abcd\", cmp),\n   M.equals(ordT (#less))),\n test(\n   \"compareWith-empty-nonempty\",\n   Text.compareWith(\"\", \"abcd\", cmp),\n   M.equals(ordT (#less))),\n test(\n   \"compareWith-prefix\",\n   Text.compareWith(\"abcd\", \"abc\", cmp),\n   M.equals(ordT (#greater)))\n]))\n};\n\ndo {\nlet cmp = func (c1 : Char, c2 : Char) : Order.Order {\n  switch (Char.compare (c1, c2)) {\n    case (#less) #greater;\n    case (#equal) #equal;\n    case (#greater) #less;\n  };\n};\nrun(suite(\"compareWith-flip\",\n[\n test(\n   \"compareWith-flip-greater\",\n   Text.compareWith(\"abc\", \"abd\", cmp),\n   M.equals(ordT (#greater))),\n test(\n   \"compareWith-flip-less\",\n   Text.compareWith(\"abd\", \"abc\", cmp),\n   M.equals(ordT (#less)))\n]))\n};\n\nrun(suite(\"utf8\",\n[\n test(\n   \"encode-literal\",\n   Text.encodeUtf8(\"FooBär☃\"),\n   M.equals(blobT(\"FooBär☃\"))),\n test(\n   \"encode-concat\",\n   Text.encodeUtf8(\"Foo\" # \"Bär\" # \"☃\"),\n   M.equals(blobT(\"FooBär☃\"))),\n test(\n   \"decode-literal-good\",\n   Text.decodeUtf8(\"FooBär☃\"),\n   M.equals(optTextT(?\"FooBär☃\"))),\n test(\n   \"decode-literal-bad1\",\n   Text.decodeUtf8(\"\\FF\"),\n   M.equals(optTextT(null))),\n test(\n   \"decode-literal-bad2\",\n   Text.decodeUtf8(\"\\D8\\00t d\"),\n   M.equals(optTextT(null))),\n]));\n"}