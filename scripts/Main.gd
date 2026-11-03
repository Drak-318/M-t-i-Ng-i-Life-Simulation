extends Node3D

const WorldBuilderScript = preload("res://scripts/WorldBuilder.gd")
const PlayerScript = preload("res://scripts/Player.gd")

var world: Node3D
var player: CharacterBody3D
var clock_label: Label
var location_label: Label
var interaction_label: Label
var system_label: Label
var minutes := 7 * 60 + 42
var elapsed := 0.0
var current_location_id := "HOME"
var current_location_name := "Nhà của Minh"
var current_interaction := "Ở nhà. Một buổi sáng Chủ nhật bình thường."
var player_state := {"energy": 82.0, "money": 15000000.0, "stress": 18.0, "confidence": 52.0, "social_energy": 55.0}
var memories: Array[String] = []

func _ready() -> void:
    _build_lighting()
    _build_world()
    _build_player()
    _build_ui()
    _update_clock()
    _update_location_ui()
    _set_system_message("Chủ nhật, 07:42. Minh thức dậy và bắt đầu ngày mới.")

func _process(delta: float) -> void:
    elapsed += delta
    if elapsed >= 1.0:
        elapsed -= 1.0
        minutes += 1
        _update_clock()

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("interact"):
        _interact()

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

func _on_location_ready(location_id: String, display_name: String, interaction_text: String) -> void:
    current_location_id = location_id
    current_location_name = display_name
    current_interaction = interaction_text
    _update_location_ui()

func _update_clock() -> void:
    var hour := int(minutes / 60) % 24
    var minute := minutes % 60
    clock_label.text = "%02d:%02d" % [hour, minute]

func _update_location_ui() -> void:
    if not location_label:
        return
    location_label.text = current_location_name
    interaction_label.text = "E — %s" % current_interaction

func _set_system_message(message: String) -> void:
    if system_label:
        system_label.text = message

func _interact() -> void:
    memories.append("visited:%s:%02d:%02d" % [current_location_id, int(minutes / 60) % 24, minutes % 60])
    player_state["energy"] = max(0.0, float(player_state["energy"]) - 1.0)
    var hour := int(minutes / 60) % 24
    var minute := minutes % 60
    _set_system_message("Bạn đã dừng lại ở %s lúc %02d:%02d. Có những ngày chẳng cần chuyện gì lớn xảy ra." % [current_location_name, hour, minute])
