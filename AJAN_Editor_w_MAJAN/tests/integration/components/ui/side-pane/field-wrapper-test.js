import {module, test} from "qunit";
import hbs from "htmlbars-inline-precompile";
import {render} from "@ember/test-helpers";
import {setupRenderingTest} from "ember-qunit";

module("Integration | Component | ui/side-pane/field-wrapper", function(hooks) {
	setupRenderingTest(hooks);

	test("it renders", async function(assert) {
		// Set any properties with this.set('myProperty', 'value');
		// Handle any actions with this.set('myAction', function(val) { ... });

		await render(hbs`{{ui/side-pane/field-wrapper}}`);

		assert.equal(this.element.textContent.trim(), "");

		// Template block usage:
		await render(hbs`
      {{#ui/side-pane/field-wrapper}}
        template block text
      {{/ui/side-pane/field-wrapper}}
    `);

		assert.equal(this.element.textContent.trim(), "template block text");
	});
});
