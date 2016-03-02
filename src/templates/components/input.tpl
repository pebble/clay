<div class="component component-input">
  <label class="tap-highlight">
    <span class="label">{{{label}}}</span>
    <span class="input">
      <input
      data-manipulator-target
        {{each key: attributes}}{{key}}="{{this}}"{{/each}}
    />
    </span>
  </label>

  {{if description}}
    <div class="description">{{{description}}}</div>
  {{/if}}
</div>
