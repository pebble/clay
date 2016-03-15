<div class="component component-slider">
  <label class="tap-highlight">
    <span class="label-container">
      <span class="label">{{{label}}}</span>
      <span class="value-wrap">
        <span class="value-pad"></span>
        <input type="text" class="value" />
      </span>
    </span>
    <span class="input">
      <input
        data-manipulator-target
        class="slider"
        type="range"
        min="{{min}}"
        max="{{max}}"
        step="{{step}}"
        {{each key: attributes}}{{key}}="{{this}}"{{/each}}
      />
    </span>
</label>
  {{if description}}
    <div class="description">{{{description}}}</div>
  {{/if}}
</div>
