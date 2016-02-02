<label class="item item-select">
  <span class="label">{{{label}}}</span>
  <span class="value"></span>
  <select data-manipulator-target>
    {{each options}}
      <option value="{{this.value}}" class="item-select-option">{{this.label}}</option>
    {{/each}}
  </select>
</label>
