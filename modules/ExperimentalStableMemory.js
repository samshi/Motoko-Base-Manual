modules.ExperimentalStableMemory={"imports":{"mo:⛔":"Prim"},"functions":{"size":{"desc":"Current size of the stable memory, in pages.\nEach page is 64KiB (65536 bytes).\nInitially `0`.\nPreserved across upgrades, together with contents of allocated\nstable memory.","body":"public let size: () -> (pages : Nat64) =\n  Prim.stableMemorySize;"},"grow":{"desc":"// Grow current `size` of stable memory by `pagecount` pages.\nEach page is 64KiB (65536 bytes).\nReturns previous `size` when able to grow.\nReturns `0xFFFF_FFFF_FFFF_FFFF` if remaining pages insufficient.\nEvery new page is zero-initialized, containing byte 0 at every offset.\nFunction `grow` is capped by a soft limit on `size` controlled by compile-time flag\n `--max-stable-pages <n>` (the default is 65536, or 4GiB).","body":"public let grow: (new_pages : Nat64) -> (oldpages : Nat64) =\n  Prim.stableMemoryGrow;"},"stableVarQuery":{"desc":"// Returns a query that, when called, returns the number of bytes of (real) IC stable memory that would be\noccupied by persisting its current stable variables before an upgrade.\nThis function may be used to monitor or limit real stable memory usage.\nThe query computes the estimate by running the first half of an upgrade, including any `preupgrade` system method.\nLike any other query, its state changes are discarded so no actual upgrade (or other state change) takes place.\nThe query can only be called by the enclosing actor and will trap for other callers.","body":"public let stableVarQuery: () -> (shared query () -> async {size : Nat64}) =\n  Prim.stableVarQuery;"},"loadBlob":{"desc":"// Load `size` bytes starting from `offset` as a `Blob`.\nTraps on out-of-bounds access.","body":"public let loadBlob: (offset : Nat64, size : Nat) -> Blob =\n  Prim.stableMemoryLoadBlob;"},"storeBlob":{"desc":"// Write bytes of `blob` beginning at `offset`.\nTraps on out-of-bounds access.","body":"public let storeBlob: (offset : Nat64, value : Blob) -> () =\n  Prim.stableMemoryStoreBlob;"}},"other":"","test":""}