modules.None={"imports":{"mo:⛔":"Prim"},"functions":{"impossible":{"desc":"Turns an absurd value into an arbitrary type.","body":"public func impossible : <A> None -> A = func<A>(x : None) : A {\n  switch (x) {};\n}"}},"other":"/// The empty type. A subtype of all types.\npublic type None = Prim.Types.None;","test":"import Array \"mo:base/Array\";\nimport None \"mo:base/None\";\nimport Debug \"mo:base/Debug\";\n\nDebug.print(\"None\");\n\ndo {\n  Debug.print(\"  impossible\");\n\n  func showNone(x : None) : Text {\n    None.impossible<Text>(x);\n  };\n};\n"}