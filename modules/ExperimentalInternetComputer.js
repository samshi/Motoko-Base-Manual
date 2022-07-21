modules.ExperimentalInternetComputer={"imports":{"mo:⛔":"Prim"},"functions":{"call":{"desc":"Calls ``canister``'s update or query function, `name`, with the binary contents of `data` as IC argument.\nReturns the response to the call, an IC _reply_ or _reject_, as a Motoko future:\n\n* The message data of an IC reply determines the binary contents of `reply`.\n* The error code and textual message data of an IC reject determines the future's `Error` value.\n\nNote: `call` is an asynchronous function and can only be applied in an asynchronous context","body":"public func call : (canister : Principal, name : Text, data : Blob) ->\n   async (reply : Blob) = Prim.call_raw;"},"countInstructions":{"desc":"// Given computation, `comp`, counts the number of actual and (for IC system calls) notional WebAssembly\ninstructions performed during the execution of `comp()`.\n\nMore precisely, returns the difference between the state of the IC instruction counter (_performance counter_ `0`) before and after executing `comp()`\n(see [Performance Counter](https://internetcomputer.org/docs/current/references/ic-interface-spec#system-api-performance-counter)).\n\nNB: `countInstructions(comp)` will _not_ account for any deferred garbage collection costs incurred by `comp()`.","body":"public func countInstructions(comp : () -> ()) : Nat64 {\n  let init = Prim.performanceCounter(0);\n  let pre = Prim.performanceCounter(0);\n  comp();\n  let post = Prim.performanceCounter(0);\n  // performance_counter costs around 200 extra instructions, we perform an empty measurement to decide the overhead\n  let overhead = pre - init;\n  post - pre - overhead\n}"}},"other":"","test":""}