#include <inttypes.h>
#include <pebble.h>
#include <pebble-clay/clay.h>

#define CLAY_INBOX_SIZE (64)
#define CHAR_SIZE (10)

static Window *s_window;
static int s_background_color = 0xff0000;
static char s_label_char_value[CHAR_SIZE] = "initial";
static bool s_label_bool_value = false;
static TextLayer *s_label_char;
static TextLayer *s_label_bool;

static void prv_update_display(Layer *layer, GContext *ctx) {
  graphics_context_set_fill_color(ctx, GColorFromHEX(s_background_color));
  graphics_fill_rect(ctx, layer_get_bounds(layer), 0, GCornerNone);

  text_layer_set_text(s_label_char, s_label_char_value);
  text_layer_set_text(s_label_bool, s_label_bool_value ? "true" : "false");
}

static void prv_clay_updated_handler(void *context) {
  clay_get_int("test_int", &s_background_color);
  clay_get_bool("test_bool", &s_label_bool_value);
  clay_get_string("test_char", s_label_char_value, CHAR_SIZE);

  layer_mark_dirty(window_get_root_layer(s_window));
}

static void prv_window_unload(Window *window) {
  layer_destroy(text_layer_get_layer(s_label_char));
  window_destroy(window);
}

static void prv_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(s_window);

  layer_set_update_proc(window_layer, prv_update_display);

  GRect bounds = layer_get_bounds(window_layer);

  s_label_char = text_layer_create(GRect(0, bounds.size.h/4, bounds.size.w, 30));
  text_layer_set_text_alignment(s_label_char, GTextAlignmentCenter);
  text_layer_set_background_color(s_label_char, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_label_char));

  s_label_bool = text_layer_create(GRect(0, bounds.size.h/2, bounds.size.w, 30));
  text_layer_set_text_alignment(s_label_bool, GTextAlignmentCenter);
  text_layer_set_background_color(s_label_bool, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_label_bool));

  prv_clay_updated_handler(NULL);
}

static void prv_init(void) {

  const ClayCallbacks clay_callbacks = {
      .settings_updated = prv_clay_updated_handler,
  };

  clay_init(CLAY_INBOX_SIZE, &clay_callbacks, NULL);

  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers) {
      .load = prv_window_load,
      .unload = prv_window_unload,
  });

  window_stack_push(s_window, true);
}

int main(void) {
  prv_init();
  app_event_loop();
}
