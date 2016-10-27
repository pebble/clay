#include "clay.h"
#include "hash.h"

#define SIMPLE_APP_MESSAGE_NAMESPACE ("CLAY")

static ClayCallbacks s_callbacks;

static uint32_t prv_hash_key(const char *key) {
  return hash((uint8_t *)key, strlen(key));
}

static bool prv_write(const char *key, const SimpleDictDataType type, const void *data, size_t data_size, void *context) {
  uint32_t persist_key = prv_hash_key(key);

  switch (type) {
    case SimpleDictDataType_Raw:
      persist_write_data(persist_key, data, data_size);
      return true;
    case SimpleDictDataType_Bool: {
      const bool value = *((bool *) data);
      persist_write_bool(persist_key, value);
      return true;
    }
    case SimpleDictDataType_Int: {
      const int value = *((int *) data);
      persist_write_int(persist_key, value);
      return true;
    }
    case SimpleDictDataType_String: {
      const char *value = data;
      persist_write_string(persist_key, value);
      return true;
    }
    case SimpleDictDataTypeCount:
      break;
  }
  APP_LOG(APP_LOG_LEVEL_ERROR, "Unexpected type %d", type);
  return false;
}

static void prv_simple_app_message_received_callback(const SimpleDict *message, void *context) {
  if (!message) {
    return;
  }

  APP_LOG(APP_LOG_LEVEL_INFO, "CLAY: Received SimpleAppMessage");
  simple_dict_foreach(message, prv_write, NULL);
  s_callbacks.settings_updated(context);
}

static bool prv_read(SimpleDictDataType type, const char *key, void *value_out, size_t size) {
  uint32_t persist_key = prv_hash_key(key);

  if (persist_exists(persist_key)) {

    switch (type) {
      case SimpleDictDataType_Raw:
//        persist_write_data(persist_key, data, data_size);
        return true;
      case SimpleDictDataType_Bool: {
        const bool value = persist_read_bool(persist_key);
        memcpy(value_out, &value, size);
        return true;
      }
      case SimpleDictDataType_Int: {
        const int value = persist_read_int(persist_key);
        memcpy(value_out, &value, size);
        return true;
      }
      case SimpleDictDataType_String: {
        persist_read_string(persist_key, value_out, size);
        return true;
      }
      case SimpleDictDataTypeCount:
        break;
    }
  }
  return false;

}

// ----- PUBLIC API -----

void clay_init(uint32_t inbox_size, const ClayCallbacks *callbacks, void *context) {
  s_callbacks = *callbacks;

  const SimpleAppMessageCallbacks simple_app_message_callbacks = {
      .message_received = prv_simple_app_message_received_callback,
  };
  const bool register_success = simple_app_message_register_callbacks(
      SIMPLE_APP_MESSAGE_NAMESPACE, &simple_app_message_callbacks, context);

  if (!register_success) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "Failed to register callbacks for namespace %s", SIMPLE_APP_MESSAGE_NAMESPACE);
    return;
  }

  const bool request_inbox_size_success = simple_app_message_request_inbox_size(inbox_size);
  if (!request_inbox_size_success) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "Failed to request inbox size of %d", (int)inbox_size);
    return;
  }

  simple_app_message_open();
}

bool clay_get_int(const char *key, int *value_out) {
  return prv_read(SimpleDictDataType_Int, key, value_out, sizeof(&value_out));
}

bool clay_get_bool(const char *key, bool *value_out) {
  return prv_read(SimpleDictDataType_Bool, key, value_out, sizeof(&value_out));
}

bool clay_get_string(const char *key, char *value_out, size_t size) {
  return prv_read(SimpleDictDataType_String, key, value_out, size);
}
