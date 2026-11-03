extends Node3D

const WorldBuilderScript = preload("res://scripts/WorldBuilder.gd")
const PlayerScript = preload("res://scripts/Player.gd")
const TimeSystemScript = preload("res://scripts/TimeSystem.gd")
const StateManagerScript = preload("res://scripts/StateManager.gd")
const MemoryManagerScript = preload("res://scripts/MemoryManager.gd")
const RelationshipManagerScript = preload("res://scripts/RelationshipManager.gd")
const EventSystemScript = preload("res://scripts/EventSystem.gd")
const SaveSystemScript = preload("res://scripts/SaveSystem.gd")
const EndingSystemScript = preload("res://scripts/EndingSystem.gd")
const LifeSystemsScript = preload("res://scripts/LifeSystems.gd")
const WeatherSystemScript = preload("res://scripts/WeatherSystem.gd")

var world: Node3D
var player: CharacterBody3D
var time_system: Node
var state_manager: Node
var memory_manager: Node
var relationship_manager: Node
var event_system: Node
var save_system: Node
var ending_system: Node
var life_systems: Node
var weather_system: Node
var important_character: Node
var sun: DirectionalLight3D
var environment: WorldEnvironment

var clock_label: Label
var location_label: Label
var interaction_label: Label
var stats_label: Label
var weather_label: Label
var system_label: Label
var dialogue_panel: PanelContainer
var dialogue_title: Label
var dialogue_text: Label
var choices_box: VBoxContainer

var current_location_id := "HOME"
var current_location_name := "Nhà của Minh"
var current_interaction := "Ở nhà. Một buổi sáng Chủ nhật bình thường."
var dialogue_open := false
var ending_shown := false

func _ready() -> void:
    _build_life_systems()
    _build_lighting()
    _build_world()
    _build_player()
    _build_ui()
    time_system.time_changed.connect(_on_time_changed)
    time_system.day_changed.connect(_on_day_changed)
    life_systems.daily_summary.connect(_set_system_message)
    relationship_manager.ensure_character("LINH")
    weather_system.set_for_day(time_system.get_day())
    _update_clock()
    _update_location_ui()
    _update_stats()
    _update_weather()
    _set_system_message("Chủ Nhật, 07:42. Minh thức dậy và bắt đầu ngày mới.")

func _process(_delta: float) -> void:
    if important_character and important_character.has_method("update_schedule"):
        important_character.update_schedule(time_system.get_day(), time_system.get_hour())
    if important_character and important_character.profile:
        important_character.profile.tick(1)
    _update_day_night()
    _update_stats()
    var triggered := event_system.tick_delayed()
    if not triggered.is_empty() and not ending_shown:
        _set_system_message("Một chuyện Minh từng làm trước đó đang quay trở lại trong cuộc sống.")

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("interact") and not dialogue_open and not ending_shown:
        _interact()
    elif event.is_action_pressed("save_game") and not dialogue_open:
        if save_system.save_game(time_system, state_manager, memory_manager, relationship_manager, event_system, player, weather_system):
            _set_system_message("Đã lưu cuộc sống hiện tại. Những gì đã xảy ra sẽ được giữ lại.")
        else:
            _set_system_message("Không thể lưu trạng thái hiện tại.")
    elif event.is_action_pressed("load_game") and not dialogue_open:
        if save_system.load_game(time_system, state_manager, memory_manager, relationship_manager, event_system, player, weather_system):
            ending_shown = false
            time_system.set_paused(false)
            dialogue_panel.visible = false
            _update_clock()
            _update_weather()
            _set_system_message("Đã tải lại cuộc sống từ lần lưu gần nhất.")
        else:
            _set_system_message("Chưa có dữ liệu lưu để tải.")

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
    event_system = EventSystemScript.new()
    event_system.name = "EventSystem"
    add_child(event_system)
    event_system.setup(state_manager, memory_manager, relationship_manager, time_system)
    save_system = SaveSystemScript.new()
    save_system.name = "SaveSystem"
    add_child(save_system)
    ending_system = EndingSystemScript.new()
    ending_system.name = "EndingSystem"
    add_child(ending_system)
    life_systems = LifeSystemsScript.new()
    life_systems.name = "LifeSystems"
    add_child(life_systems)
    life_systems.setup(state_manager, time_system)
    weather_system = WeatherSystemScript.new()
    weather_system.name = "WeatherSystem"
    add_child(weather_system)

func _build_lighting() -> void:
    sun = DirectionalLight3D.new()
    sun.rotation_degrees = Vector3(-55, -25, 0)
    sun.light_energy = 1.15
    sun.shadow_enabled = true
    add_child(sun)
    environment = WorldEnvironment.new()
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
    important_character = world.important_character

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
    weather_label = Label.new()
    weather_label.position = Vector2(24, 123)
    weather_label.add_theme_font_size_override("font_size", 14)
    ui.add_child(weather_label)
    stats_label = Label.new()
    stats_label.position = Vector2(24, 147)
    stats_label.add_theme_font_size_override("font_size", 14)
    ui.add_child(stats_label)
    system_label = Label.new()
    system_label.position = Vector2(24, 650)
    system_label.add_theme_font_size_override("font_size", 17)
    ui.add_child(system_label)
    var controls := Label.new()
    controls.position = Vector2(1010, 18)
    controls.text = "WASD  Di chuyển\nE       Tương tác\nP       Lưu\nL       Tải"
    controls.add_theme_font_size_override("font_size", 16)
    ui.add_child(controls)

    dialogue_panel = PanelContainer.new()
    dialogue_panel.position = Vector2(180, 405)
    dialogue_panel.size = Vector2(920, 230)
    dialogue_panel.visible = false
    ui.add_child(dialogue_panel)
    var margin := MarginContainer.new()
    margin.add_theme_constant_override("margin_left", 24)
    margin.add_theme_constant_override("margin_right", 24)
    margin.add_theme_constant_override("margin_top", 18)
    margin.add_theme_constant_override("margin_bottom", 18)
    dialogue_panel.add_child(margin)
    var dialogue_box := VBoxContainer.new()
    dialogue_box.add_theme_constant_override("separation", 8)
    margin.add_child(dialogue_box)
    dialogue_title = Label.new()
    dialogue_title.add_theme_font_size_override("font_size", 22)
    dialogue_box.add_child(dialogue_title)
    dialogue_text = Label.new()
    dialogue_text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    dialogue_text.add_theme_font_size_override("font_size", 17)
    dialogue_box.add_child(dialogue_text)
    choices_box = VBoxContainer.new()
    choices_box.add_theme_constant_override("separation", 5)
    dialogue_box.add_child(choices_box)

func _on_time_changed(_day: int, _hour: int, _minute: int) -> void:
    _update_clock()

func _on_day_changed(day: int) -> void:
    weather_system.set_for_day(day)
    _update_weather()
    _set_system_message("Một ngày mới bắt đầu. Ngày %d của cuộc đời này." % day)
    if day >= 8 and not ending_shown:
        _show_ending()

func _update_day_night() -> void:
    if sun == null or environment == null:
        return
    var hour := time_system.get_hour() + time_system.get_minute() / 60.0
    var daylight := clamp((sin((hour - 6.0) / 24.0 * TAU) + 0.25) / 1.25, 0.12, 1.0)
    sun.light_energy = lerp(0.22, 1.15, daylight)
    environment.environment.ambient_light_energy = lerp(0.25, 0.8, daylight)
    sun.rotation_degrees = Vector3(-25.0 - daylight * 45.0, -25.0, 0.0)

func _update_weather() -> void:
    if weather_label and weather_system:
        weather_label.text = weather_system.get_display_text()

func _update_clock() -> void:
    if clock_label and time_system:
        clock_label.text = "%s  •  %s" % [time_system.get_day_text(), time_system.get_clock_text()]

func _update_location_ui() -> void:
    if not location_label:
        return
    location_label.text = current_location_name
    interaction_label.text = "E — %s" % current_interaction

func _update_stats() -> void:
    if not stats_label or not state_manager:
        return
    stats_label.text = "Năng lượng %d   Căng thẳng %d   Tự tin %d   Xã hội %d   Tiền %s" % [int(state_manager.get_value("energy")), int(state_manager.get_value("stress")), int(state_manager.get_value("confidence")), int(state_manager.get_value("social_energy")), _format_money(float(state_manager.get_value("money")))]

func _format_money(value: float) -> String:
    return "%.1fM" % (value / 1000000.0)

func _set_system_message(message: String) -> void:
    if system_label:
        system_label.text = message

func _interact() -> void:
    var scene := event_system.request_scene(current_location_id)
    if not scene.is_empty():
        _open_dialogue(scene)
        return
    var minute := time_system.get_total_minutes()
    memory_manager.remember("visited_%s" % current_location_id, "player_interaction", minute, 0.05, ["location", current_location_id])
    state_manager.change_value("energy", -1.0)
    _set_system_message("Bạn đã dừng lại ở %s. Có những ngày chẳng cần chuyện gì lớn xảy ra." % current_location_name)

func _open_dialogue(scene: Dictionary) -> void:
    dialogue_open = true
    time_system.set_paused(true)
    dialogue_panel.visible = true
    dialogue_title.text = str(scene.get("title", ""))
    dialogue_text.text = str(scene.get("text", ""))
    for child in choices_box.get_children():
        child.queue_free()
    var choices: Array = scene.get("choices", [])
    for index in choices.size():
        var button := Button.new()
        button.text = "%d. %s" % [index + 1, str(choices[index].get("text", ""))]
        button.custom_minimum_size = Vector2(0, 30)
        button.pressed.connect(_on_choice_pressed.bind(index))
        choices_box.add_child(button)

func _on_choice_pressed(index: int) -> void:
    var result := event_system.choose(index)
    dialogue_open = false
    dialogue_panel.visible = false
    time_system.set_paused(false)
    if result.is_empty():
        return
    _set_system_message(str(result.get("text", "")) + "  Thời gian vẫn tiếp tục trôi.")

func _show_ending() -> void:
    ending_shown = true
    time_system.set_paused(true)
    var ending := ending_system.evaluate(state_manager, relationship_manager, memory_manager)
    dialogue_open = true
    dialogue_panel.visible = true
    dialogue_title.text = str(ending.get("title", ""))
    dialogue_text.text = str(ending.get("text", ""))
    for child in choices_box.get_children():
        child.queue_free()
    var close_button := Button.new()
    close_button.text = "Giữ lại cuộc sống này"
    close_button.custom_minimum_size = Vector2(0, 36)
    close_button.pressed.connect(_close_ending)
    choices_box.add_child(close_button)
    _set_system_message("Một tuần đã trôi qua. Không phải mọi thứ đều có câu trả lời.")

func _close_ending() -> void:
    dialogue_open = false
    dialogue_panel.visible = false
    _set_system_message("Bạn có thể tiếp tục đi lại và nhìn thế giới sau tuần đầu tiên, hoặc tải một lần lưu cũ.")
