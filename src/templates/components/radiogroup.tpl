<div class="">
  <span class="label">{{{label}}}</span>
  <div data-manipulator-target>
    {{each options}}
      <label class="item">
        <span class="label">{{{this.label}}}</span>
        <input
          type="radio"
          class="item-radio"
          name="{{this.index}}"
          value="{{this.value}}"
        />
      </label>
    {{/each}}
  </div>
</div>
