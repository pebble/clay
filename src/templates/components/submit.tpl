<div class="component component-submit">
  <button
    data-manipulator-target
    type="submit"
    {{each key: attributes}}{{key}}="{{this}}"{{/each}}
  ></button>
</div>
