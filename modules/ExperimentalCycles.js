modules.ExperimentalCycles={"imports":{"mo:⛔":"Prim"},"functions":{"balance":{"desc":"Returns the actor's current balance of cycles as `amount`.","body":"public let balance: () -> (amount : Nat) = Prim.cyclesBalance;"},"available":{"desc":"// Returns the currently available `amount` of cycles.\nThe amount available is the amount received in the current call,\nminus the cumulative amount `accept`ed by this call.\nOn exit from the current shared function or async expression via `return` or `throw`\nany remaining available amount is automatically\nrefunded to the caller/context.","body":"public let available: () -> (amount : Nat) = Prim.cyclesAvailable;"},"accept":{"desc":"// Transfers up to `amount` from `available()` to `balance()`.\nReturns the amount actually transferred, which may be less than\nrequested, for example, if less is available, or if canister balance limits are reached.","body":"public let accept: (amount : Nat) -> (accepted : Nat) = Prim.cyclesAccept;"},"add":{"desc":"// Indicates additional `amount` of cycles to be transferred in\nthe next call, that is, evaluation of a shared function call or\nasync expression.\nTraps if the current total would exceed 2^128 cycles.\nUpon the call, but not before, the total amount of cycles ``add``ed since\nthe last call is deducted from `balance()`.\nIf this total exceeds `balance()`, the caller traps, aborting the call.\n\n**Note**: the implicit register of added amounts is reset to zero on entry to\na shared function and after each shared function call or resume from an await.","body":"public let add: (amount : Nat) -> () = Prim.cyclesAdd;"},"refunded":{"desc":"// Reports `amount` of cycles refunded in the last `await` of the current\ncontext, or zero if no await has occurred yet.\nCalling `refunded()` is solely informational and does not affect `balance()`.\nInstead, refunds are automatically added to the current balance,\nwhether or not `refunded` is used to observe them.","body":"public let refunded: () -> (amount : Nat) = Prim.cyclesRefunded;"}},"related":"","test":""}