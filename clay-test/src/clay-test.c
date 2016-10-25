#include <inttypes.h>
#include <pebble.h>
#include <pebble-clay/clay.h>

#define CLAY_INBOX_SIZE (64)

static Window *s_window;
static int s_background_color;

static void draw_background(Layer *layer, GContext *ctx) {
  graphics_context_set_fill_color(ctx, GColorFromHEX(s_background_color));
  graphics_fill_rect(ctx, layer_get_bounds(layer), 0, GCornerNone);
}

static void prv_update_layer(Layer *layer, GContext *ctx) {
  draw_background(layer, ctx);
}


static void prv_window_unload(Window *window) {
  window_destroy(window);
}

static void prv_window_load(Window *window) {
  layer_set_update_proc(window_get_root_layer(s_window), prv_update_layer);
}

static void prv_clay_updated_handler(void *context) {
  int value_int;
  if (clay_get_int("test_int", &value_int)) {
    s_background_color = value_int;
  }

  layer_mark_dirty(window_get_root_layer(s_window));
}

static void prv_init(void) {

  const ClayCallbacks clay_callbacks = (ClayCallbacks) {
      .settings_updated = prv_clay_updated_handler,
  };
  clay_register_callbacks(&clay_callbacks, NULL);

  clay_init(CLAY_INBOX_SIZE);

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



//int s_background_color = 0xffffff;
//#define TEXT_SIZE 20;
//char s_text [TEXT_SIZE];
//
//void clay_update_handler(void *ctx) {
//  clay_get_int("background_color", &s_background_color);
//  clay_get_string("background_color", &s_text, TEXT_SIZE - 1);
//}
