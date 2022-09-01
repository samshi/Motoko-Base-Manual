# Motoko-Base-Manual

install php

install git@github.com:dfinity/motoko-base.git at xxx/motoko-base

install git@github.com:samshi/Motoko-Base-Manual.git at xxx/motoko-base-manual

xxx/motoko-base-manual: node app.js

open xxx/motoko-base-manual/ at browser

public func decodeFloat(bytes: [Nat8]) : ?Float {
    var bits: Nat64 = Binary.BigEndian.toNat64(bytes);
    let (exponentBitLength: Nat64, mantissaBitLength: Nat64) = switch(bytes.size()) {
        case (2) {
            (5: Nat64, 10: Nat64);
        };
        case (4) {
            (8: Nat64, 23: Nat64);
        };
        case (8) {
            (11: Nat64, 52: Nat64);
        };
        case (a) return null; 
    };
    // Bitshift to get mantissa, exponent and sign bits
    let mantissaBits: Nat64 = bits & (Nat64.pow(2, mantissaBitLength) - 1);
    let exponentBits: Nat64 = (bits >> mantissaBitLength) & (Nat64.pow(2, exponentBitLength) - 1);
    let signBits: Nat64 = (bits >> (mantissaBitLength + exponentBitLength)) & 0x01;

    // Convert bits into numbers
    let e: Int64 = Int64.pow(2, Int64.fromNat64(exponentBits) - ((Int64.fromNat64(Nat64.pow(2, exponentBitLength) / 2)) - 1));
    let maxOffsetInverse: Float = Float.pow(2, Float.fromInt64(Int64.fromNat64(mantissaBitLength)) * -1);
    let m: Float = 1.0 + (Float.fromInt64(Int64.fromNat64(mantissaBits)) * maxOffsetInverse);

    var floatValue: Float = Float.fromInt64(e) * m;

    // Make negative if sign bit is 1
    if (signBits == 1) {
        floatValue := Float.mul(floatValue, -1.0);
    };
    
    ?floatValue;
}