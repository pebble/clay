<div class="component component-button">
  <button
    data-manipulator-target
    type="submit"
    {{each key: attributes}}{{key}}="{{this}}"{{/each}}
  >
    {{{label}}}
  </button>
</div>