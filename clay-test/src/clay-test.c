#include <inttypes.h>
#include <pebble.h>
#include <pebble-clay/clay.h>

#define CLAY_INBOX_SIZE (64)
#define CHAR_SIZE (10)
#define ARRAY_SIZE (3)
#define INT_DEFAULT (0xff0000)
#define CHAR_DEFAULT ("default")
#define BOOL_DEFAULT (false)

static Window *s_window;
static int s_background_color = INT_DEFAULT;
static char s_label_char_value[CHAR_SIZE] = CHAR_DEFAULT;
static bool s_label_bool_value = BOOL_DEFAULT;
static bool s_label_array_value_raw[ARRAY_SIZE] = {true, false, true};
static char s_label_array_value[ARRAY_SIZE + 1] = {'0', '0', '0'};
static TextLayer *s_label_char;
static TextLayer *s_label_bool;
static TextLayer *s_label_array;

static void prv_update_display(Layer *layer, GContext *ctx) {
  graphics_context_set_fill_color(ctx, GColorFromHEX(s_background_color));
  graphics_fill_rect(ctx, layer_get_bounds(layer), 0, GCornerNone);

  text_layer_set_text(s_label_char, s_label_char_value);
  text_layer_set_text(s_label_bool, s_label_bool_value ? "true" : "false");

  for (int i = 0; i < ARRAY_SIZE; ++i) {
    if (s_label_array_value_raw[i]) {
      s_label_array_value[i] = '1';
    }
  }

  text_layer_set_text(s_label_array, s_label_array_value);
}

static void prv_clay_updated_handler(void *context) {
  clay_get_int("test_int", &s_background_color);
  clay_get_bool("test_bool", &s_label_bool_value);
  clay_get_string("test_char", s_label_char_value, CHAR_SIZE);

  layer_mark_dirty(window_get_root_layer(s_window));
}

static void prv_window_unload(Window *window) {
  layer_destroy(text_layer_get_layer(s_label_char));
  layer_destroy(text_layer_get_layer(s_label_bool));
  layer_destroy(text_layer_get_layer(s_label_array));
  window_destroy(window);
}

static void prv_select_click_handler(ClickRecognizerRef recognizer, void *context) {
  s_background_color = 0x00ff00;
  clay_set_int("test_int", &s_background_color);

  s_label_bool_value = true;
  clay_set_bool("test_bool", &s_label_bool_value);

  strcpy(s_label_char_value, "internal");
  clay_set_string("test_char", s_label_char_value);

  layer_mark_dirty(window_get_root_layer(s_window));
}

static void prv_up_click_handler(ClickRecognizerRef recognizer, void *context) {
  s_background_color = INT_DEFAULT;
  clay_set_int("test_int", &s_background_color);

  s_label_bool_value = BOOL_DEFAULT;
  clay_set_bool("test_bool", &s_label_bool_value);

  strcpy(s_label_char_value, CHAR_DEFAULT);
  clay_set_string("test_char", s_label_char_value);

  layer_mark_dirty(window_get_root_layer(s_window));
}


static void prv_click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, prv_select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, prv_up_click_handler);
}

static void prv_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(s_window);

  layer_set_update_proc(window_layer, prv_update_display);

  GRect bounds = layer_get_bounds(window_layer);

  s_label_char = text_layer_create(GRect(0, bounds.size.h / 4, bounds.size.w, 30));
  text_layer_set_text_alignment(s_label_char, GTextAlignmentCenter);
  text_layer_set_background_color(s_label_char, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_label_char));

  s_label_bool = text_layer_create(GRect(0, bounds.size.h / 2, bounds.size.w, 30));
  text_layer_set_text_alignment(s_label_bool, GTextAlignmentCenter);
  text_layer_set_background_color(s_label_bool, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_label_bool));

  s_label_array = text_layer_create(GRect(0, 3 * (bounds.size.h / 4), bounds.size.w, 30));
  text_layer_set_text_alignment(s_label_array, GTextAlignmentCenter);
  text_layer_set_background_color(s_label_array, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_label_array));

  prv_clay_updated_handler(NULL);
}

static void prv_init(void) {

  const ClayCallbacks clay_callbacks = {
      .settings_updated = prv_clay_updated_handler,
  };

  clay_register_callbacks(&clay_callbacks, NULL);
  clay_init(CLAY_INBOX_SIZE, true);

  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers) {
      .load = prv_window_load,
      .unload = prv_window_unload,
  });

  window_set_click_config_provider(s_window, prv_click_config_provider);

  window_stack_push(s_window, true);
}

int main(void) {
  prv_init();
  app_event_loop();
}
