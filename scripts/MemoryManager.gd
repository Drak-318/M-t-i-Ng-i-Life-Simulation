extends Node

## Memory không chỉ là log.
## Một memory có thể được tạo, gắn cảm xúc và dùng lại bởi story engine sau này.

signal memory_added(memory: Dictionary)

var memories: Array[Dictionary] = []

func remember(memory_id: String, source: String, game_minute: int, emotional_weight: float = 0.0, tags: Array[String] = []) -> void:
    var memory := {
        "id": memory_id,
        "source": source,
        "game_minute": game_minute,
        "emotional_weight": emotional_weight,
        "tags": tags,
        "created": true,
        "emotionally_associated": abs(emotional_weight) >= 0.25,
        "triggerable": true
    }
    memories.append(memory)
    memory_added.emit(memory)

func has_memory(memory_id: String) -> bool:
    for memory in memories:
        if memory.get("id") == memory_id:
            return true
    return false

func find_by_tag(tag: String) -> Array[Dictionary]:
    var result: Array[Dictionary] = []
    for memory in memories:
        if tag in memory.get("tags", []):
            result.append(memory)
    return result

func snapshot() -> Array[Dictionary]:
    return memories.duplicate(true)

func restore(snapshot_data: Array[Dictionary]) -> void:
    memories = snapshot_data.duplicate(true)
