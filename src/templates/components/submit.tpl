<div class="component component-button">
  <button
    data-manipulator-target
    type="submit"
    {{each key: attributes}}{{key}}="{{this}}"{{/each}}
  ></button>
</div>
