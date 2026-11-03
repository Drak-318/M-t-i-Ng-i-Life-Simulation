extends Node

signal weather_changed(weather: String)

var weather := "clear"
var temperature := 30.0
var rng := RandomNumberGenerator.new()

func _ready() -> void:
    rng.randomize()

func set_for_day(day: int) -> void:
    rng.seed = day * 7919
    var roll := rng.randf()
    if roll < 0.52:
        weather = "clear"
        temperature = rng.randf_range(28.0, 34.0)
    elif roll < 0.78:
        weather = "cloudy"
        temperature = rng.randf_range(27.0, 32.0)
    elif roll < 0.94:
        weather = "rain"
        temperature = rng.randf_range(25.0, 30.0)
    else:
        weather = "storm"
        temperature = rng.randf_range(24.0, 29.0)
    weather_changed.emit(weather)

func get_display_text() -> String:
    var labels := {"clear":"Trời quang","cloudy":"Nhiều mây","rain":"Mưa","storm":"Mưa lớn"}
    return "%s • %.0f°C" % [labels.get(weather, weather), temperature]

func snapshot() -> Dictionary:
    return {"weather":weather,"temperature":temperature}

func restore(data: Dictionary) -> void:
    weather = str(data.get("weather", "clear"))
    temperature = float(data.get("temperature", 30.0))
