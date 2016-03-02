<div class="component component-color">
  <label class="tap-highlight">
    <input
      data-manipulator-target
      type="hidden"
    />
    <span class="label">{{{label}}}</span>
    <span class="value"></span>
  </label>
  {{if description}}
    <div class="description">{{{description}}}</div>
  {{/if}}
  <div class="picker-wrap">
    <div class="picker">
      <div class="color-box-wrap">
        <div class="color-box-container"></div>
      </div>
    </div>
  </div>
</div>
