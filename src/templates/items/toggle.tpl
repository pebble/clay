<label class="item">
  <span class="label">{{{label}}}</span>
  <span class="input">
    <input
      data-manipulator-target
      type="checkbox"
      {{each key: attributes}}{{key}}="{{this}}"{{/each}}
    />
  </span>
</label>
