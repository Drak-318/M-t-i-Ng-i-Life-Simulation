extends Node3D

const WorldBuilderScript = preload("res://scripts/WorldBuilder.gd")
const PlayerScript = preload("res://scripts/Player.gd")
const TimeSystemScript = preload("res://scripts/TimeSystem.gd")
const StateManagerScript = preload("res://scripts/StateManager.gd")
const MemoryManagerScript = preload("res://scripts/MemoryManager.gd")
const RelationshipManagerScript = preload("res://scripts/RelationshipManager.gd")

var world: Node3D
var player: CharacterBody3D
var time_system: Node
var state_manager: Node
var memory_manager: Node
var relationship_manager: Node
var clock_label: Label
var location_label: Label
var interaction_label: Label
var system_label: Label
var current_location_id := "HOME"
var current_location_name := "Nhà của Minh"
var current_interaction := "Ở nhà. Một buổi sáng Chủ nhật bình thường."

func _ready() -> void:
    _build_life_systems()
    _build_lighting()
    _build_world()
    _build_player()
    _build_ui()
    time_system.time_changed.connect(_on_time_changed)
    time_system.day_changed.connect(_on_day_changed)
    _update_clock()
    _update_location_ui()
    _set_system_message("Chủ nhật, 07:42. Minh thức dậy và bắt đầu ngày mới.")

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("interact"):
        _interact()

func _build_life_systems() -> void:
    time_system = TimeSystemScript.new()
    time_system.name = "TimeSystem"
    add_child(time_system)
    state_manager = StateManagerScript.new()
    state_manager.name = "StateManager"
    add_child(state_manager)
    memory_manager = MemoryManagerScript.new()
    memory_manager.name = "MemoryManager"
    add_child(memory_manager)
    relationship_manager = RelationshipManagerScript.new()
    relationship_manager.name = "RelationshipManager"
    add_child(relationship_manager)

func _build_lighting() -> void:
    var sun := DirectionalLight3D.new()
    sun.rotation_degrees = Vector3(-55, -25, 0)
    sun.light_energy = 1.15
    sun.shadow_enabled = true
    add_child(sun)
    var environment := WorldEnvironment.new()
    var env := Environment.new()
    env.background_mode = Environment.BG_COLOR
    env.background_color = Color(0.55, 0.66, 0.78)
    env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    env.ambient_light_color = Color(0.72, 0.76, 0.82)
    env.ambient_light_energy = 0.75
    environment.environment = env
    add_child(environment)

func _build_world() -> void:
    world = WorldBuilderScript.new()
    world.name = "Neighborhood"
    add_child(world)
    world.location_ready.connect(_on_location_ready)

func _build_player() -> void:
    player = PlayerScript.new()
    player.name = "NguyenMinh"
    player.add_to_group("player")
    player.position = Vector3(-12, 0.2, 11.0)
    add_child(player)

func _build_ui() -> void:
    var ui := CanvasLayer.new()
    ui.name = "UI"
    add_child(ui)
    clock_label = Label.new()
    clock_label.position = Vector2(24, 18)
    clock_label.add_theme_font_size_override("font_size", 30)
    ui.add_child(clock_label)
    location_label = Label.new()
    location_label.position = Vector2(24, 62)
    location_label.add_theme_font_size_override("font_size", 19)
    ui.add_child(location_label)
    interaction_label = Label.new()
    interaction_label.position = Vector2(24, 94)
    interaction_label.add_theme_font_size_override("font_size", 16)
    ui.add_child(interaction_label)
    system_label = Label.new()
    system_label.position = Vector2(24, 640)
    system_label.add_theme_font_size_override("font_size", 17)
    ui.add_child(system_label)
    var controls := Label.new()
    controls.position = Vector2(1030, 18)
    controls.text = "WASD  Di chuyển\nE       Tương tác"
    controls.add_theme_font_size_override("font_size", 16)
    ui.add_child(controls)

func _on_time_changed(_day: int, _hour: int, _minute: int) -> void:
    _update_clock()

func _on_day_changed(day: int) -> void:
    _set_system_message("Một ngày mới bắt đầu. Ngày %d của cuộc đời này." % day)

func _on_location_ready(location_id: String, display_name: String, interaction_text: String) -> void:
    current_location_id = location_id
    current_location_name = display_name
    current_interaction = interaction_text
    _update_location_ui()

func _update_clock() -> void:
    if clock_label and time_system:
        clock_label.text = "%s  •  %s" % [time_system.get_day_text(), time_system.get_clock_text()]

func _update_location_ui() -> void:
    if not location_label:
        return
    location_label.text = current_location_name
    interaction_label.text = "E — %s" % current_interaction

func _set_system_message(message: String) -> void:
    if system_label:
        system_label.text = message

func _interact() -> void:
    var minute := time_system.get_total_minutes()
    memory_manager.remember(
        "visited_%s" % current_location_id,
        "player_interaction",
        minute,
        0.05,
        ["location", current_location_id]
    )
    state_manager.change_value("energy", -1.0)
    _set_system_message("Bạn đã dừng lại ở %s. Có những ngày chẳng cần chuyện gì lớn xảy ra." % current_location_name)
