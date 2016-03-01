<div class="component component-checkbox">
  <span class="label">{{{label}}}</span>
  <div class="checkbox-group">
    {{each options}}
      <label class="tap-highlight">
        <span class="label">{{{this.label}}}</span>
        <input
          type="checkbox"
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
