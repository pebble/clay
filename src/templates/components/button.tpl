<div class="component component-button">
  <button
    type="button"
    data-manipulator-target
    class="{{primary ? 'primary' : ''}}"
    {{each key: attributes}}{{key}}="{{this}}"{{/each}}
  ></button>
  {{if description}}
    <div class="description">{{{description}}}</div>
  {{/if}}
</div>
