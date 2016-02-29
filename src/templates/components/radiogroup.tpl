<div class="component component-radio">
  <span class="label">{{{label}}}</span>
  <div class="radio-group">
    {{each options}}
      <label class="tap-highlight">
        <span class="label">{{{this.label}}}</span>
        <input
          type="radio"
          value="{{this.value}}"
          name="clay-{{clayId}}"
          data-manipulator-target
          {{each key: attributes}}{{key}}="{{this}}"{{/each}}
        />
        <i></i>
      </label>
    {{/each}}
  </div>
</div>
