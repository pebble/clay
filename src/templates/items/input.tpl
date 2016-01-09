<label class="item">
  <span class="label">{{{label}}}</span>
  <span class="input">
    <input
      data-manipulator-target
      type="text"
      {{each key: attributes}}{{key}}="{{this}}"{{/each}}
    />
  </span>
</label>
