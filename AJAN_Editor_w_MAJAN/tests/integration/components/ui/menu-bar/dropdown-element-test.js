import {module, test} from "qunit";
import hbs from "htmlbars-inline-precompile";
import {render} from "@ember/test-helpers";
import {setupRenderingTest} from "ember-qunit";

module("Integration | Component | ui/menu-bar/dropdown-element", function(
	hooks
) {
	setupRenderingTest(hooks);

	test("it renders", async function(assert) {
		// Set any properties with this.set('myProperty', 'value');
		// Handle any actions with this.set('myAction', function(val) { ... });

		await render(hbs`{{ui/menu-bar/dropdown-element}}`);

		assert.equal(this.element.textContent.trim(), "");

		// Template block usage:
		await render(hbs`
      {{#ui/menu-bar/dropdown-element}}
        template block text
      {{/ui/menu-bar/dropdown-element}}
    `);

		assert.equal(this.element.textContent.trim(), "template block text");
	});
});
