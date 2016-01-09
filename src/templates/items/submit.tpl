<div class="button-container">
  <input
    data-manipulator-target
    type="submit"
    class="item-button"
    value="{{label}}"
    {{each key: attributes}}{{key}}="{{this}}"{{/each}}
  >
</div>
