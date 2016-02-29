<label class="component component-select tap-highlight">
  <span class="label">{{{label}}}</span>
  <span class="value"></span>
  <select data-manipulator-target {{each key: attributes}}{{key}}="{{this}}"{{/each}}>
    {{each options}}
      <option value="{{this.value}}" class="item-select-option">{{this.label}}</option>
    {{/each}}
  </select>
</label>
