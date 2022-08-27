modules.TrieSet={"imports":{"Trie":"Trie","Hash":"Hash","List":"List"},"functions":{"Hash":{"desc":"","body":"public type Hash= Hash.Hash;"},"empty":{"desc":"// Empty set.","body":"public func empty<T>() : Set<T> { Trie.empty<T,()>(); };"},"put":{"desc":"// Put an element into the set.","body":"public func put<T>(s : Set<T>, x : T, xh : Hash, eq : (T, T) -> Bool) : Set<T> {\n  let (s2, _) = Trie.put<T,()>(s, { key = x; hash = xh }, eq, ());\n  s2\n}"},"delete":{"desc":"Delete an element from the set.","body":"public func delete<T>(s : Set<T>, x : T, xh : Hash, eq : (T, T) -> Bool) : Set<T> {\n  let (s2, _) = Trie.remove<T, ()>(s, { key = x; hash = xh }, eq);\n  s2\n}"},"equal":{"desc":"Test if two sets are equal.","body":"public func equal<T>(s1 : Set<T>, s2 : Set<T>, eq : (T, T) -> Bool) : Bool {\n  // XXX: Todo: use a smarter check\n  func unitEqual (_ : (),_ : ()) : Bool { true };\n  Trie.equalStructure<T, ()>(s1, s2, eq, unitEqual)\n}"},"size":{"desc":"The number of set elements, set's cardinality.","body":"public func size<T>(s : Set<T>) : Nat {\n  Trie.foldUp<T, (), Nat>(\n    s,\n    func(n : Nat, m : Nat) : Nat { n + m },\n    func(_ : T, _ : ()) : Nat { 1 },\n    0\n  )\n}"},"mem":{"desc":"Test if a set contains a given element.","body":"public func mem<T>(s : Set<T>, x : T, xh : Hash, eq : (T, T) -> Bool) : Bool {\n  switch (Trie.find<T, ()>(s, { key = x; hash = xh }, eq)) {\n    case null { false };\n    case (?_) { true };\n  }\n}"},"union":{"desc":"[Set union](https://en.wikipedia.org/wiki/Union_(set_theory)).","body":"public func union<T>(s1 : Set<T>, s2 : Set<T>, eq : (T, T) -> Bool) : Set<T> {\n  let s3 = Trie.merge<T, ()>(s1, s2, eq);\n  s3\n}"},"diff":{"desc":"[Set difference](https://en.wikipedia.org/wiki/Difference_(set_theory)).","body":"public func diff<T>(s1 : Set<T>, s2 : Set<T>, eq : (T, T) -> Bool) : Set<T> {\n  let s3 = Trie.diff<T, (), ()>(s1, s2, eq);\n  s3\n}"},"intersect":{"desc":"[Set intersection](https://en.wikipedia.org/wiki/Intersection_(set_theory)).","body":"public func intersect<T>(s1 : Set<T>, s2 : Set<T>, eq : (T, T) -> Bool) : Set<T> {\n  let noop : ((), ()) -> (()) = func (_ : (), _ : ()) : (()) = ();\n  let s3 = Trie.join<T, (), (), ()>(s1, s2, eq, noop);\n  s3\n}"},"fromArray":{"desc":"/ Construct a set from an array.","body":"public func fromArray<T>(arr : [T], elemHash : T -> Hash, eq : (T, T) -> Bool) : Set<T> {\n  var s = empty<T>();\n  for (elem in arr.vals()) {\n    s := put<T>(s, elem, elemHash(elem), eq);\n  };\n  s\n}"},"toArray":{"desc":"/ Returns the set as an array.","body":"public func toArray<T>(s : Set<T>): [T] {\n  Trie.toArray(s, func (t : T, _ : ()) : T { t })\n}"}},"related":"","test":"import Nat \"mo:base/Nat\";\nimport TrieSet \"mo:base/TrieSet\";\nimport Nat32 \"mo:base/Nat32\";\nimport Hash \"mo:base/Hash\";\nimport Suite \"mo:matchers/Suite\";\nimport M \"mo:matchers/Matchers\";\nimport T \"mo:matchers/Testable\";\n\nlet simpleTests = do {\n  let set1 = TrieSet.fromArray<Nat>([ 1, 2, 3, 1, 2, 3, 1 ], Nat32.fromNat, Nat.equal);\n\n  let suite = Suite.suite(\"TrieSet fromArray\", [\n    Suite.test(\n      \"mem\",\n      TrieSet.mem<Nat>(set1, 1, 1, Nat.equal),\n      M.equals(T.bool true)\n    ),\n    Suite.test(\n      \"size\",\n      TrieSet.size(set1),\n      M.equals(T.nat 3)\n    ),\n    Suite.test(\n      \"toArray\",\n      TrieSet.toArray<Nat>(set1),\n      M.equals(T.array<Nat>(T.natTestable, [ 1, 2, 3 ]))\n    )\n  ]);\n  Suite.run(suite);\n};\n\nlet binopTests = do {\n  let a = TrieSet.fromArray<Nat>([1, 3], Hash.hash, Nat.equal);\n  let b = TrieSet.fromArray<Nat>([2, 3], Hash.hash, Nat.equal);\n\n  let suite = Suite.suite(\"TrieSet -- binary operations\", [\n    Suite.test(\"union\",\n      TrieSet.toArray(TrieSet.union(a, b, Nat.equal)),\n      M.equals(T.array<Nat>(T.natTestable, [1, 2, 3]))\n    ),\n    Suite.test(\"intersect\",\n      TrieSet.toArray(TrieSet.intersect(a, b, Nat.equal)),\n      M.equals(T.array<Nat>(T.natTestable, [3]))\n    ),\n    Suite.test(\"diff\",\n      TrieSet.toArray(TrieSet.diff(a, b, Nat.equal)),\n      M.equals(T.array<Nat>(T.natTestable, [1]))\n    ),\n  ]);\n  Suite.run(suite);\n};\n\n"}