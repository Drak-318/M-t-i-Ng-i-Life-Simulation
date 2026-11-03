extends Node

func _ready() -> void:
    var time = preload("res://scripts/TimeSystem.gd").new()
    var state = preload("res://scripts/StateManager.gd").new()
    var memory = preload("res://scripts/MemoryManager.gd").new()
    var relationship = preload("res://scripts/RelationshipManager.gd").new()
    var events = preload("res://scripts/EventSystem.gd").new()
    var endings = preload("res://scripts/EndingSystem.gd").new()
    var save = preload("res://scripts/SaveSystem.gd").new()
    var player := Node3D.new()

    add_child(time)
    add_child(state)
    add_child(memory)
    add_child(relationship)
    add_child(events)
    add_child(endings)
    add_child(save)
    add_child(player)

    relationship.ensure_character("LINH")
    events.setup(state, memory, relationship, time)
    var first_scene: Dictionary = events.request_scene("HOME")
    assert(not first_scene.is_empty(), "Expected the first HOME scene")
    assert(first_scene.get("id") == "morning_home", "Expected morning_home")
    var result := events.choose(0)
    assert(not result.is_empty(), "Expected a choice result")
    assert(memory.has_memory("chose_to_stay_home"), "Expected memory to be recorded")

    relationship.change("LINH", "affection", 10.0)
    relationship.change("LINH", "trust", 5.0)
    relationship.change("LINH", "closeness", 5.0)
    var ending: Dictionary = endings.evaluate(state, relationship, memory)
    assert(not ending.is_empty(), "Expected an ending state")

    assert(save.save_game(time, state, memory, relationship, events, player), "Expected save to succeed")
    player.position = Vector3(10, 0, 10)
    assert(save.load_game(time, state, memory, relationship, events, player), "Expected load to succeed")

    print("LIFE_SIMULATION_SMOKE_TEST=PASS")
    get_tree().quit(0)
