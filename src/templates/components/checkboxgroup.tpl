<div class="component component-checkbox">
  <span class="label">{{{label}}}</span>
  <div class="checkbox-group">
    {{each options}}
      <label class="tap-highlight">
        <span class="label">{{{this}}}</span>
        <input type="checkbox" value="1" name="clay-{{clayId}}" />
        <i></i>
      </label>
    {{/each}}
  </div>
  {{if description}}
    <div class="description">{{{description}}}</div>
  {{/if}}
</div>
