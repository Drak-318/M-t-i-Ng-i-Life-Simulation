extends Node

## Local save/load for the life-state MVP.
## The save contains state, memories, relationships and story progress.

const SAVE_PATH := "user://life_simulation_save.json"

func save_game(time_system: Node, state_manager: Node, memory_manager: Node, relationship_manager: Node, event_system: Node, player: Node3D) -> bool:
    var data := {
        "version": 1,
        "time": time_system.snapshot(),
        "state": state_manager.snapshot(),
        "memories": memory_manager.snapshot(),
        "relationships": relationship_manager.snapshot(),
        "story": event_system.snapshot(),
        "player_position": {"x": player.global_position.x, "y": player.global_position.y, "z": player.global_position.z}
    }
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file == null:
        return false
    file.store_string(JSON.stringify(data))
    file.close()
    return true

func load_game(time_system: Node, state_manager: Node, memory_manager: Node, relationship_manager: Node, event_system: Node, player: Node3D) -> bool:
    if not FileAccess.file_exists(SAVE_PATH):
        return false
    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if file == null:
        return false
    var parsed = JSON.parse_string(file.get_as_text())
    file.close()
    if not (parsed is Dictionary):
        return false
    time_system.restore(parsed.get("time", {}))
    state_manager.restore(parsed.get("state", {}))
    memory_manager.restore(parsed.get("memories", []))
    relationship_manager.restore(parsed.get("relationships", {}))
    event_system.restore(parsed.get("story", {}))
    var pos: Dictionary = parsed.get("player_position", {})
    if pos.has("x"):
        player.global_position = Vector3(float(pos.get("x", 0.0)), float(pos.get("y", 0.2)), float(pos.get("z", 0.0)))
    return true

func has_save() -> bool:
    return FileAccess.file_exists(SAVE_PATH)
