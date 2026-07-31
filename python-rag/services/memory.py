from langchain_core.chat_history import InMemoryChatMessageHistory

# Stores one memory object per conversation
_memory_store = {}


def get_memory(conversation_id: str):
    """
    Returns the memory object for a conversation.
    Creates one if it doesn't exist.
    """
    if conversation_id not in _memory_store:
        _memory_store[conversation_id] = InMemoryChatMessageHistory()

    return _memory_store[conversation_id]


def get_messages(conversation_id: str):
    """
    Returns all messages for a conversation.
    """
    return get_memory(conversation_id).messages


def add_user_message(conversation_id: str, message: str):
    """
    Adds a user message.
    """
    memory = get_memory(conversation_id)
    memory.add_user_message(message)

    # Keep only the last 20 messages
    if len(memory.messages) > 20:
        memory.messages = memory.messages[-20:]


def add_ai_message(conversation_id: str, message: str):
    """
    Adds an AI message.
    """
    memory = get_memory(conversation_id)
    memory.add_ai_message(message)

    # Keep only the last 20 messages
    if len(memory.messages) > 20:
        memory.messages = memory.messages[-20:]


def clear_memory(conversation_id: str):
    """
    Clears one conversation.
    """
    if conversation_id in _memory_store:
        del _memory_store[conversation_id]


def clear_all_memory():
    """
    Clears all conversations.
    """
    _memory_store.clear()