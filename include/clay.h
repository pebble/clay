#pragma once

#include <@keegan-stoneware/simple-app-message/simple-app-message.h>

typedef void (*ClayUpdatedCallback)(void *context);

typedef struct ClayCallbacks {
  ClayUpdatedCallback settings_updated;
} ClayCallbacks;

void clay_init(uint32_t inbox_size, bool open_app_message);

void clay_register_callbacks(const ClayCallbacks *callbacks, void *context);

bool clay_remove(const char *key);

bool clay_set_bool(const char *key, bool value);

bool clay_set_data(const char *key, const void *data, size_t n);

bool clay_set_int(const char *key, int value);

bool clay_set_string(const char *key, const char *value);

bool clay_get_bool(const char *key, bool *value_out);

bool clay_get_data(const char *key, void *value_out, size_t n);

bool clay_get_int(const char *key, int *value_out);

bool clay_get_string(const char *key, char *value_out, size_t size);
