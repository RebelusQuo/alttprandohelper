var _ = require('lodash');

// Invokes the predicate with the arguments supplied through 'cases'.
// The cases can be single values where each becomes the sole argument to
// the predicate, or multiple arrays where each array become the arguments,
// or an object where each key, value pair becomes the two arguments.
// The arguments can then be used to paramentarize an #it invocation.
//
// 1. cases (Object|...Array|...*): The arguments that constitute the cases.
// 2. predicate (Function): The function to invoke for setting up the spec functions.
exports.with_cases = (...cases) => {
    const func = cases.pop();
    const [obj] = cases;
    _.each(
        _.isPlainObject(obj) ? _.toPairs(obj) : cases,
        params => func(..._.castArray(params))
    );
};
