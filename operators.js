var operators = {
   '+': function(a, b){ return a+b},
   '-': function(a, b){ return a-b},
   '>': function(a, b){ return a>b},
   '>=': function(a, b){ return a>=b},
   '<': function(a, b){ return a<b},
   '<=': function(a, b){ return a<=b},
   '==': function(a, b){ return a==b},
   '!=': function(a, b){ return a!=b}
}

module.exports.Operators = operators;
