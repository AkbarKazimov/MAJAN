import {module, test} from "qunit";
import {setupTest} from "ember-qunit";

module("Unit | Service | behaviors/query-insertion-manager", function(hooks) {
	setupTest(hooks);

	// Replace this with your real tests.
	test("it exists", function(assert) {
		let service = this.owner.lookup(
			"service:behaviors/query-insertion-manager"
		);
		assert.ok(service);
	});
});
