extends Node

signal relationship_changed(character_id: String, key: String, value: float)

var relationships: Dictionary = {}

const DEFAULT_LAYERS := {
    "affection": 0.0,
    "trust": 0.0,
    "understanding": 0.0,
    "closeness": 0.0,
    "respect": 0.0,
    "hurt": 0.0,
    "irritation": 0.0,
    "compatibility": 50.0,
    "willingness_to_continue": 50.0
}

func ensure_character(character_id: String) -> void:
    if not relationships.has(character_id):
        relationships[character_id] = DEFAULT_LAYERS.duplicate(true)

func get_value(character_id: String, key: String, fallback: float = 0.0) -> float:
    ensure_character(character_id)
    return float(relationships[character_id].get(key, fallback))

func change(character_id: String, key: String, amount: float) -> void:
    ensure_character(character_id)
    var current := float(relationships[character_id].get(key, 0.0))
    relationships[character_id][key] = clamp(current + amount, -100.0, 100.0)
    relationship_changed.emit(character_id, key, relationships[character_id][key])

func apply_changes(character_id: String, changes: Dictionary) -> void:
    for key in changes.keys():
        change(character_id, str(key), float(changes[key]))

func set_value(character_id: String, key: String, value: float) -> void:
    ensure_character(character_id)
    relationships[character_id][key] = clamp(value, -100.0, 100.0)
    relationship_changed.emit(character_id, key, relationships[character_id][key])

func snapshot() -> Dictionary:
    return relationships.duplicate(true)

func restore(snapshot_data: Dictionary) -> void:
    relationships = snapshot_data.duplicate(true)
