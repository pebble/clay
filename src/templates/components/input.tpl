<label class="component component-input tap-highlight">
  <span class="label">{{{label}}}</span>
  <span class="input">
    <input
      data-manipulator-target
      {{each key: attributes}}{{key}}="{{this}}"{{/each}}
    />
  </span>
</label>
