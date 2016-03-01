<label class="component component-toggle tap-highlight">
  <span class="label">{{{label}}}</span>
  <span class="input">
    <input
      data-manipulator-target
      type="checkbox"
      {{each key: attributes}}{{key}}="{{this}}"{{/each}}
    />
    <span class="graphic">
      <span class="slide"></span>
      <span class="marker"></span>
    </span>
  </span>
</label>
