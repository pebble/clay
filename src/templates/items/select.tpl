<label class="item">
  <span class="label">{{{label}}}</span>
  <select data-manipulator-target class="item-select">
    {{each options}}
      <option value="{{value}}" class="item-select-option">{{{label}}}</option>
    {{/each}}
  </select>
</label>
