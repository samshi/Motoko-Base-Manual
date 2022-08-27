modules.Blob={"imports":{"mo:⛔":"Prim"},"functions":{"Blob":{"desc":"An immutable, possibly empty sequence of bytes.\nGiven `b : Blob`:\n\n* `b.size() : Nat` returns the number of bytes in the blob;\n* `b.vals() : Iter.Iter<Nat8>` returns an iterator to enumerate the bytes of the blob.\n\n(Direct indexing of Blobs is not yet supported.)","body":"public type Blob= Prim.Types.Blob;"},"hash":{"desc":"// Returns a (non-cryptographic) hash of 'b'","body":"public let hash: (b : Blob) -> Nat32 = Prim.hashBlob;"},"equal":{"desc":"// Returns `x == y`.","body":"public func equal(x : Blob, y : Blob) : Bool { x == y };"},"notEqual":{"desc":"// Returns `x != y`.","body":"public func notEqual(x : Blob, y : Blob) : Bool { x != y };"},"less":{"desc":"// Returns `x < y`.","body":"public func less(x : Blob, y : Blob) : Bool { x < y };"},"lessOrEqual":{"desc":"// Returns `x <= y`.","body":"public func lessOrEqual(x : Blob, y : Blob) : Bool { x <= y };"},"greater":{"desc":"// Returns `x > y`.","body":"public func greater(x : Blob, y : Blob) : Bool { x > y };"},"greaterOrEqual":{"desc":"// Returns `x >= y`.","body":"public func greaterOrEqual(x : Blob, y : Blob) : Bool { x >= y };"},"compare":{"desc":"// Returns the order of `x` and `y`.","body":"public func compare(x : Blob, y : Blob) : { #less; #equal; #greater } {\n  if (x < y) { #less }\n  else if (x == y) { #equal }\n  else { #greater }\n}"},"fromArray":{"desc":"Creates a blob from an array of bytes, by copying each element.","body":"public let fromArray: [Nat8] -> Blob = Prim.arrayToBlob;"},"fromArrayMut":{"desc":"// Creates a blob from a mutable array of bytes, by copying each element.","body":"public let fromArrayMut: [var Nat8] -> Blob = Prim.arrayMutToBlob;"},"toArray":{"desc":"// Creates an array of bytes from a blob, by copying each element.","body":"public let toArray: Blob -> [Nat8] = Prim.blobToArray;"},"toArrayMut":{"desc":"// Creates a mutable array of bytes from a blob, by copying each element.","body":"public let toArrayMut: Blob -> [var Nat8] = Prim.blobToArrayMut;"}},"related":"","test":""}