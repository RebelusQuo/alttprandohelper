const sinon = require('sinon');
const sinon_chai = require('sinon-chai');
const chai_each = require('chai-each');
const chai = require('chai');
const _ = require('lodash');

const a = sinon.match;
_.assign(a, { ref: a.same });

const helpers = (chai, utils) => {
    utils.addProperty(chai.Assertion.prototype, 'truthy', function() {
        this.assert(
            !!this._obj,
            'expected #{this} to be truthy',
            'expected #{this} to not be truthy'
        );
    });

    utils.addProperty(chai.Assertion.prototype, 'falsy', function() {
        this.assert(
            !this._obj,
            'expected #{this} to be falsy',
            'expected #{this} to not be falsy'
        );
    });
};

chai.use(helpers);
chai.use(sinon_chai);
chai.use(chai_each);
chai.should();

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

exports.expect = chai.expect;
exports.sinon = sinon;
exports.a = a;
