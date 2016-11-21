#include "clay.h"
#include "hash.h"

#define SIMPLE_APP_MESSAGE_NAMESPACE ("CLAY")

static ClayCallbacks s_callbacks;

static uint32_t prv_hash_key(const char *key) {
  return hash((uint8_t *)key, (uint32_t)strlen(key));
}

static bool prv_read(const char *key, void *value_out, size_t size) {
  uint32_t persist_key = prv_hash_key(key);
  int bytes_read = persist_read_data(persist_key, value_out, size);
  return bytes_read >= 0 && (size_t)bytes_read == size;
}

static bool prv_write(const char *key, const void *data, size_t size) {
  uint32_t persist_key = prv_hash_key(key);
  int bytes_written = persist_write_data(persist_key, data, size);
  return bytes_written >= 0 && (size_t)bytes_written == size;
}

static bool prv_simple_dict_foreach_callback(
    const char *key, SimpleDictDataType type, const void *data, size_t size, void *context) {
  return prv_write(key, data, size);
}

static void prv_simple_app_message_received_callback(const SimpleDict *message, void *context) {
  if (!message) return;

  simple_dict_foreach(message, prv_simple_dict_foreach_callback, NULL);
  s_callbacks.settings_updated(context);
}

// ----- PUBLIC API -----

void clay_init(uint32_t inbox_size, bool open_app_message) {
  const bool request_inbox_size_success = simple_app_message_request_inbox_size(inbox_size);
  if (!request_inbox_size_success) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "CLAY: Failed to request inbox size of %d", (int)inbox_size);
    return;
  }

  if (!open_app_message) return;

  const AppMessageResult open_state = simple_app_message_open();
  if (open_state != APP_MSG_OK) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "CLAY: Failed to open appmessage inbox. Code: %d", open_state);
  }
}

void clay_register_callbacks(const ClayCallbacks *callbacks, void *context) {
  s_callbacks = *callbacks;

  const SimpleAppMessageCallbacks simple_app_message_callbacks = {
      .message_received = prv_simple_app_message_received_callback,
  };
  const bool register_success = simple_app_message_register_callbacks(
      SIMPLE_APP_MESSAGE_NAMESPACE, &simple_app_message_callbacks, context);

  if (!register_success) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "CLAY: Failed to register callbacks for namespace %s",
        SIMPLE_APP_MESSAGE_NAMESPACE);
  }
}

bool clay_get_int(const char *key, int *value_out) {
  return prv_read(key, value_out, sizeof(*value_out));
}

bool clay_get_bool(const char *key, bool *value_out) {
  return prv_read(key, value_out, sizeof(*value_out));
}

bool clay_get_string(const char *key, char *value_out, size_t size) {
  return prv_read(key, value_out, size);
}

bool clay_get_data(const char *key, void *value_out, size_t size) {
  return prv_read(key, value_out, size);
}

bool clay_set_int(const char *key, int *value) {
  return prv_write(key, value, sizeof(value));
}

bool clay_set_bool(const char *key, bool *value) {
  return prv_write(key, value, sizeof(value));
}

bool clay_set_data(const char *key, const void *value, size_t size) {
  return prv_write(key, value, size);
}

bool clay_set_string(const char *key, const char *value) {
  return prv_write(key, value, strlen(value));
}
